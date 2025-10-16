import React from "react";
import { RxCross2 } from "react-icons/rx";
import { PiMicrophoneDuotone } from "react-icons/pi";
import { BorderBeam } from "@/components/magicui/border-beam";
import { Highlighter } from "@/components/magicui/highlighter";

import { Table, LineChart, Infinity, Brackets } from "lucide-react";
import { Spinner } from "../ui/kibo-ui/spinner";

export const latexSuggestions = [
  {
    id: 1,
    suggestion: `Create a simple table with borders and centered text.`,
    icon: Table
  },
  {
    id: 2,
    suggestion: `Create a definite integral with limits.`,
    icon: LineChart
  },
  {
    id: 3,
    suggestion: `Create a formula for a Taylor series expansion.`,
    icon: Infinity
  },
  {
    id: 4,
    suggestion: `Define a system of linear equations.`,
    icon: Brackets
  }
];

const DialogModal = ({
  title,
  isLoading,
  inputValue,
  setInputValue,
  submitHandler,
  onClose,
  buttonText = "Submit",
  label = "",
  disabled,
  content,
  BtnIcon,
  generateAiStatus = true
}) => (
  <div className="fixed inset-0 bg-[#151515b2] backdrop-blur-[2px] z-50 flex items-center justify-center">
    <div className="bg-white backdrop-blur-sm rounded-lg shadow-lg p-6 w-[500px] max-[400px]:w-[320px] max-[450px]:w-[380px] h-max">
      {/* TOP SECTION */}
      <div className="flex justify-end items-center rounded-full ">
        <RxCross2
          onClick={onClose}
          className="text-icon hover:text-gray-800 text-xl cursor-pointer"
        />
      </div>

      {/* HEADING SECTION */}
      <div className="flex flex-col gap-2 items-center mb-4 rounded-full ">
        <h1 className="w-full h-max text-primary text-[24px] font-semibold text-center">
          {title}
        </h1>

        {generateAiStatus && (
          <h2 className="w-full h-max text-primary text-[24px] font-semibold text-center gap-2">
            <Highlighter action="highlight" color="#ff7a5a">
              Generate
            </Highlighter>
            Latex using Ai
          </h2>
        )}

        {label && (
          <h1 className="w-full h-max text-center text-black ">{label}</h1>
        )}
      </div>

      {/* If there's content prop (for correction), show it. Else, show input */}
      {content ? (
        content
      ) : (
        <>
          <div className="area-section border-2 border-shadow rounded-md w-full h-max flex flex-col items-center">
            <textarea
              className="w-full h-[100px] rounded p-2 resize-none outline-0 scrollbar-none"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={isLoading}
              placeholder="Ask me anything..."
            />

            <div className="bottom-section w-full bg-shadow h-max flex items-center justify-between px-2 py-2 ">
              <PiMicrophoneDuotone className={`w-5 h-5`} />
              <button
                className={`text-primary text-[16px]  w-max rounded-md cursor-pointer hover:scale-110 transition-transform duration-200 font-semibold flex items-center gap-2`}
                onClick={submitHandler}
                disabled={isLoading || disabled}
              >
                {inputValue.length > 0 && !isLoading && !disabled && BtnIcon && (
                  <BtnIcon className={`w-5 h-5`} />
                )}

                {
                  isLoading && (
                   <Spinner className={`text-primary`}/>
                  )
                }
              </button>
            </div>
          </div>

          {generateAiStatus && (
            <div className="suggestion-section grid grid-cols-2 gap-2 mt-4">
              {latexSuggestions.map((item) => {
                return (
                  <div
                    className="suggestion w-full h-[100px] flex flex-col gap-2 p-4 bg-shade rounded-md text-icon text-[14px] font-medium cursor-pointer hover:scale-95 transition-transform duration-200"
                    onClick={() => setInputValue(item.suggestion)}
                  >
                    <item.icon className="w-5 h-5" />
                    <h1>{item.suggestion}</h1>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      <BorderBeam
        duration={6}
        delay={3}
        size={400}
        borderWidth={4}
        className="from-transparent via-secondary to-transparent"
      />
    </div>
  </div>
);

export default DialogModal;
