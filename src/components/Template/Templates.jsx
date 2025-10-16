import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import template01 from "../../assests/Template/homeTemplate01.jpg";
import template02 from "../../assests/Template/homeTemplate02.jpg";
import template03 from "../../assests/Template/homeTemplate03.jpg";

const TemplatesData = [
  {
    image: template01,
    title: "PhD Thesis Template",
    desc: "Templates to guide you through your most important academic work."
  },
  {
    image: template02,
    title: "Example Project",
    desc: "Customizable, ready-to-use assignment templates."
  },
  {
    image: template03,
    title: "CV Template",
    desc: "Stand out from the start with our professionally designed CV templates."
  },
    {
    image: template01,
    title: "PhD Thesis Template",
    desc: "Templates to guide you through your most important academic work."
  },
  {
    image: template02,
    title: "Example Project",
    desc: "Customizable, ready-to-use assignment templates."
  },
  {
    image: template03,
    title: "CV Template",
    desc: "Stand out from the start with our professionally designed CV templates."
  },
];

const Templates = () => {
  const arr = [...TemplatesData, ...TemplatesData];
  console.log(arr);

  return (
    <div className="w-full h-max">
      {/* header-section */}
      <div className="header w-full h-max flex items-center justify-between my-20 max-[450px]:my-15 px-16 max-[450px]:px-5">
        {/* bullet point */}
        <li className="w-max font-[600] text-[20px] tracking-[5px] max-[450px]:hidden ">
          TEMPLATES
        </li>
        <div className=" cursor-pointer service-icon uppercase w-max h-max flex items-center max-[450px]:w-full max-[450px]:justify-end text-[20px] gap-2 font-semibold tracking-[5px] hover:scale-95 transition-transform duration-200">
          <span>
            VIEW ALL <span>templates</span>
          </span>
          <IoIosArrowForward size={20} />
        </div>
      </div>

      {/* slide-show-section */}
      <div className="overflow-hidden w-screen h-[600px]">
        <div
          className="slider-track flex gap-10 w-max h-max animate-scroll-left hover:"
          aria-hidden="true"
        >
          {arr.map((item, index) => (
            <div className="image-container w-[450px] h-[500px] rounded-[40px] border-[1px]">
              <img
                key={index}
                src={item.image}
                alt={`template-demo`}
                className="w-full h-auto object-cover rounded-[40px]"
              />

              <div className="headers p-6 border-t-2">
                <h1 className="text-[25px] font-semibold">{item.title}</h1>
                <p>{item.desc}</p>
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Templates;
