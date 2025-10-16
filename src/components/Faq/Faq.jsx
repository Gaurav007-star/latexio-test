import React from "react";
import Navbar from "../../components/Layout/Navbar";
import background from "../../assests/background/about_background.png";
import { BsPatchPlus } from "react-icons/bs";
import { BsPatchMinusFill } from "react-icons/bs";
import { faqs } from "../../constants/constants";
import Footer from "../../components/Layout/Footer";
import Topsection from "../../components/Layout/Topsection";
import Partners from "../../components/Layout/Partners";

const Faq = () => {
  return (
    <div className="w-full h-max relative">
      {/* navbar */}
      <Navbar />

      {/* top-section */}
      <Topsection label={"Have some Queries?"} image={background} />

      {/* questions-section */}
      <div className=" w-screen h-max px-[10vh] mb-15 flex flex-col">
        <h1 className="w-full h-max font-semibold text-[60px] leading-[107%] py-20 max-[1025px]:text-[40px] max-[450px]:text-[30px]">
          Here are some of the more common questions we get asked
        </h1>

        {/* question-answer-section */}
        <div className="flex flex-col mb-5 cursor-pointer">
          {/* questions and answer */}
          {faqs.map((faq, i) => {
            return (
              <details
                key={i}
                className="group [&_summary::-webkit-details-marker]:hidden border-t-2 py-10"
              >
                <summary className="flex items-center gap-2 text-gray-900">
                  {/* icon section */}
                  <div className="icons-section">
                    <BsPatchPlus className="text-[25px] block shrink-0 group-open:hidden" />
                    <BsPatchMinusFill className=" text-[25px]  hidden shrink-0 group-open:block text-secondary" />
                  </div>

                  {/* question-section */}
                  <h2 className="text-[25px] font-semibold max-[450px]:text-[16px] hover:scale-95 transition-transform duration-200">
                    {faq.question}
                  </h2>
                </summary>

                {/* answer-section */}
                <p className="pt-2 text-gray-900 font-light transition-transform duration-300 max-[1025px]:text-[20px]">
                  {faq.answer}
                </p>
              </details>
            );
          })}
        </div>
      </div>

      {/* partners section */}
      <Partners />

      {/* footer */}
      <Footer />
      
    </div>
  );
};

export default Faq;
