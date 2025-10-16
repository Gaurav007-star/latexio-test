import React from "react";
import { Button } from "../ui/button";
import { PiShareFat } from "react-icons/pi";
import { IoClose } from "react-icons/io5";
import { BorderBeam } from "../magicui/border-beam";
const InputDialog = ({ Component, toggle, closeModal }) => {
  return (
    <>
      {/* Put this part before </body> tag */}

      <input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        checked={toggle}
      />
      <div className="modal " role="dialog">
        <div className="modal-box p-4 text-black w-[450px] h-max overflow-hidden">
          <div className="top w-full h-max flex justify-end ">
            <span
              className={`share-button  rounded-4xl hover:bg-none`}
              onClick={closeModal}
            >
              <IoClose className="text-2xl" />
            </span>
          </div>
          {Component && Component}
          <BorderBeam
            duration={6}
            delay={3}
            size={400}
            borderWidth={4}
            className="from-transparent via-secondary to-transparent"
          />
        </div>

        <label
          className="modal-backdrop"
          htmlFor="my_modal_7"
          onClick={closeModal}
        >
          Close
        </label>
      </div>
    </>
  );
};

export default InputDialog;
