import React from "react";
import { explore } from "../constants/constants";

const Explore = () => {
  return (
    <div className="w-full h-max  bg-dark px-16 max-[450px]:px-5 ">
      {/* explore section */}

      <div className="explore-wrapper w-full h-max flex justify-center items-end max-[1025px]:flex-col max-[1025px]:items-center gap-12 py-[7vh]">
        {explore.map((item, i) => (
          <div
            key={i}
            className="explore-section w-[395px] h-[410px] flex flex-col items-start justify-center text-white max-[1025px]:w-full max-[1025px]:h-max "
          >
            <img src={item?.image} alt="icon" className="w-[70px] h-[70px] max-[1025px]:w-[100px] max-[1025px]:h-[100px]" />
            <h1 className="w-full h-[50px] max-[450px]:h-max text-[22px] font-bold mt-5 max-[1025px]:text-[30px] max-[450px]:text-[25px] ">
              {item?.heading}
            </h1>
            <p className="w-full h-[100px] max-[450px]:h-max mt-3 max-[1025px]:text-[25px] max-[1025px]:mb-5 max-[450px]:mb-0 max-[450px]:text-[16px]">{item?.paragraph}</p>
            <span className="cursor-pointer w-full mt-5 text-secondary text-[20px] max-[1025px]:mt-10 max-[1025px]:text-[40px] max-[450px]:text-[30px] hover:scale-105 hover:translate-x-4 transition-transform duration-200">
              Explore
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Explore;
