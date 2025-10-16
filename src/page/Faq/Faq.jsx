import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../components/Layout/Navbar";
import background from "../../assests/faq/faqBackground.jpg";
import { BsPatchPlus } from "react-icons/bs";
import { BsPatchMinusFill } from "react-icons/bs";
import { faqs } from "../../constants/constants";
import Footer from "../../components/Layout/Footer";
import Topsection from "../../components/Layout/Topsection";
import Partners from "../../components/Layout/Partners";
import { Element, scroller } from "react-scroll";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { GoDotFill } from "react-icons/go";

const Faq = () => {
  const containerRef = useRef(null);
  const [activeSection, setActiveSection] = useState("general-section");

  const scrollToSection = (target) => {
    scroller.scrollTo(target, {
      duration: 500,
      smooth: "easeInOutQuart",
      containerId: "faq-scroll-container",
      offset: -10
    });
  };

  // scroll-handling-section
  useEffect(() => {
    const container = containerRef.current;

    const handleScroll = () => {
      const sections = [
        {
          name: "general-section",
          el: document.getElementById("general-section")
        },
        {
          name: "communication-section",
          el: document.getElementById("communication-section")
        },
        {
          name: "process-section",
          el: document.getElementById("process-section")
        }
      ];

      const containerTop = container.getBoundingClientRect().top;
      const containerHeight = container.clientHeight;

      let current = "general-section";

      for (let section of sections) {
        if (section.el) {
          const sectionTop = section.el.getBoundingClientRect().top;
          const relativeTop = sectionTop - containerTop;

          if (relativeTop < containerHeight / 2) {
            current = section.name;
          }
        }
      }

      if (current !== activeSection) {
        setActiveSection(current);
      }
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSection]);

  return (
    <div className="w-full h-max relative">
      {/* navbar */}
      <Navbar />

      {/* top-section */}
      <Topsection label={"Got questions? "} image={background} />

      {/* questions-section */}
      <div className=" w-full h-max px-[10vh] mb-15 flex">
        {/* comment:link-section */}
        <div className="left-link-section w-[35%] h-[70vh] mt-20 flex items-center">
          <ul className="w-full h-max flex flex-col gap-4 text-[28px] font-medium">
            <li
              onClick={() => scrollToSection("general-section")}
              className={`cursor-pointer flex items-center ${
                activeSection === "general-section"
                  ? "text-secondary font-semibold"
                  : ""
              }`}
            >
              {activeSection == "general-section" ? (
                <GoDotFill className="w-6 h-6 text-secondary" />
              ) : (
                ""
              )}
              General Questions
            </li>

            <li
              onClick={() => scrollToSection("communication-section")}
              className={`cursor-pointer flex items-center ${
                activeSection === "communication-section"
                  ? "text-secondary font-semibold"
                  : ""
              }`}
            >
              {activeSection == "communication-section" ? (
                <GoDotFill className="w-6 h-6 text-secondary" />
              ) : (
                ""
              )}
              Communications Related
            </li>

            <li
              onClick={() => scrollToSection("process-section")}
              className={`cursor-pointer flex items-center ${
                activeSection === "process-section"
                  ? "text-secondary font-semibold"
                  : ""
              }`}
            >
              {activeSection == "process-section" ? (
                <GoDotFill className="w-6 h-6 text-secondary" />
              ) : (
                ""
              )}
              Process Related
            </li>
          </ul>
        </div>

        {/* comment:right-section-where-we-show-questions-answers */}
        <div
          ref={containerRef}
          id="faq-scroll-container"
          className="custom-scrollbar right-faq-section w-[65%] h-[900px] overflow-y-scroll "
        >
          <h1 className="w-full h-max font-semibold text-[50px] leading-[107%] py-20 max-[1025px]:text-[40px] max-[450px]:text-[30px]">
            Here are some of the more common questions we get asked
          </h1>

          {/* question-answer-section */}
          <div className="flex flex-col mb-5 cursor-pointer ">
            <Element name="general-section">
              <div id="general-section">
                <h1 className="text-[30px] font-bold mb-10 flex items-center gap-2">
                  <SparklesIcon className="w-8 h-8 text-primary" />
                  General questions
                </h1>
                {faqs.map((faq, i) => (
                  <details
                    key={`gen-${i}`}
                    className="group [&_summary::-webkit-details-marker]:hidden border-t-2 py-10"
                  >
                    <summary className="flex items-center gap-2 text-gray-900">
                      <div className="icons-section">
                        <BsPatchPlus className="text-[25px] block shrink-0 group-open:hidden" />
                        <BsPatchMinusFill className="text-[25px] hidden shrink-0 group-open:block text-secondary" />
                      </div>
                      <h2 className="text-[25px] font-semibold max-[450px]:text-[16px] hover:scale-95 transition-transform duration-200">
                        {faq.question}
                      </h2>
                    </summary>
                    <p className="pt-2 text-gray-900 font-light max-[1025px]:text-[20px]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </Element>

            {/* Communication Questions */}
            <Element name="communication-section">
              <div id="communication-section">
                <h1 className="text-[30px] font-bold my-10 flex items-center">
                  <SparklesIcon className="w-8 h-8 text-primary" />
                  Communication questions
                </h1>
                {faqs.map((faq, i) => (
                  <details
                    key={`comm-${i}`}
                    className="group [&_summary::-webkit-details-marker]:hidden border-t-2 py-10"
                  >
                    <summary className="flex items-center gap-2 text-gray-900">
                      <div className="icons-section">
                        <BsPatchPlus className="text-[25px] block shrink-0 group-open:hidden" />
                        <BsPatchMinusFill className="text-[25px] hidden shrink-0 group-open:block text-secondary" />
                      </div>
                      <h2 className="text-[25px] font-semibold max-[450px]:text-[16px] hover:scale-95 transition-transform duration-200">
                        {faq.question}
                      </h2>
                    </summary>
                    <p className="pt-2 text-gray-900 font-light max-[1025px]:text-[20px]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </Element>

            {/* Process Questions */}
            <Element name="process-section">
              <div id="process-section">
                <h1 className="text-[30px] font-bold my-10 flex items-center">
                  <SparklesIcon className="w-8 h-8 text-primary" />
                  Process related questions
                </h1>
                {faqs.map((faq, i) => (
                  <details
                    key={`proc-${i}`}
                    className="group [&_summary::-webkit-details-marker]:hidden border-t-2 py-10"
                  >
                    <summary className="flex items-center gap-2 text-gray-900">
                      <div className="icons-section">
                        <BsPatchPlus className="text-[25px] block shrink-0 group-open:hidden" />
                        <BsPatchMinusFill className="text-[25px] hidden shrink-0 group-open:block text-secondary" />
                      </div>
                      <h2 className="text-[25px] font-semibold max-[450px]:text-[16px] hover:scale-95 transition-transform duration-200">
                        {faq.question}
                      </h2>
                    </summary>
                    <p className="pt-2 text-gray-900 font-light max-[1025px]:text-[20px]">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </Element>
          </div>
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
