import React from "react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const Introduction = ({ listData, topSectionData, btn }) => {
  const navigate = useNavigate();

  return (
    <div className="introduction-section w-full h-max px-16 max-[1025px]:px-20 max-[450px]:px-5 ">
      {/* introduction first part */}
      <div className="introduction-first-part w-full h-max flex items-center mt-15 mb-20 max-[450px]:my-5 max-[1025px]:flex-col">
        {/* left-side */}
        <div className="left w-[35%] h-[303px] flex items-center max-[1025px]:justify-center overflow-hidden max-[1025px]:w-full max-[1025px]:h-[400px] max-[450px]:h-[300px]">
          <img
            src={topSectionData.image}
            alt="icon/layout"
            className="w-fit h-full bg-cover bg-center"
          />
        </div>

        {/* right-side */}
        <div className="right w-[65%] h-max pl-4 text-dark max-[1025px]:w-full ">
          <h1 className="font-semibold text-[60px] max-[1025px]:text-center max-[450px]:text-left max-[1025px]:text-[55px] max-[450px]:text-[30px] leading-[98%] max-[1025px]:mt-10 max-[450px]:mt-5">
            {topSectionData.title}
          </h1>
          <p className="text-[25px] max-[1025px]:text-center max-[450px]:text-left font-light leading-[140%] mt-10 max-[450px]:mt-5 max-[1025px]:text-[40px] max-[450px]:text-[20px]">
            {topSectionData.desc}
          </p>

          {/* button section */}
          {btn ? (
            <div className="button-container w-max h-max max-[1025px]:w-full max-[1025px]:flex items-center justify-center mt-10 max-[450px]:mt-5">
              <Button
                onClick={() => navigate("/pricing")}
                className={`bg-secondary  rounded-full max-[1025px]:w-[70%] max-[450px]:w-full  max-[1025px]:h-[50px] max-[450px]:h-[40px] `}
              >
                {btn.label}
              </Button>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>

      {/* introduction list sets*/}
      {listData.map((item, i) => {
        return (
          <div
            key={i}
            className="introduction-list-set w-full h-max flex items-center my-20 max-[450px]:my-5 max-[1025px]:flex-col"
          >
            {item?.image_side == "left" ? (
              <div className="w-full h-max flex items-center max-[1025px]:flex-col">
                {/* left-side */}
                <div className="left w-[60%] min-[1600px]:w-[70%] h-[365px] min-[1600px]:h-[420px] flex justify-start items-center max-[1025px]:justify-center overflow-hidden max-[1025px]:w-full max-[1025px]:h-[450px] max-[450px]:h-[300px]">
                  <img
                    src={item?.image}
                    alt="icon/layout"
                    className="w-fit h-full bg-cover bg-center "
                  />
                </div>

                {/* right side */}
                <div className={`right w-[40%] min-[1600px]:w-[30%] h-max text-[#1E1E1E] flex flex-col max-[1025px]:w-full max-[1025px]:pl-5`}
                >
                  <h1 className="text-[32px] font-[600] leading-[140%] max-[1025px]:text-center max-[450px]:text-left max-[1025px]:text-[50px] max-[1025px]:mt-10 max-[450px]:mt-2 max-[450px]:text-[30px]">
                    {item?.heading}
                  </h1>
                  {item?.paragraph ? (
                    <p className="text-[25px] leading-[140%] max-[1025px]:text-center max-[450px]:text-left font-light mb-10 max-[450px]:mb-5 mt-2 pr-5 max-[1025px]:text-[30px] max-[450px]:text-[20px]">
                      {item?.paragraph}
                    </p>
                  ) : (
                    <div className="my-2"></div>
                  )}

                  {item.details.map((value, index) => {
                    return (
                      <span
                        key={index}
                        className="flex items-center max-[1025px]:justify-center max-[450px]:justify-start text-[22px] max-[1025px]:text-[25px] leading-[179%] font-light max-[450px]:text-[16px]"
                      >
                        <img
                          src="./star_icon.png"
                          alt="star/icon"
                          className="w-[16px] h-[16px] mr-2"
                        />
                        {value}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="w-full h-max flex items-center max-[1025px]:flex-col-reverse">
                {/* left side */}
                <div className="right w-[60%] h-max text-[#1E1E1E] max-[1025px]:w-full max-[1025px]:pl-5">
                  <h1 className="text-[32px] font-[600] max-[1025px]:text-center leading-[140%] max-[1025px]:text-[50px] max-[1025px]:mt-10 max-[450px]:mt-2 max-[450px]:text-[30px] max-[450px]:text-left">
                    {item?.heading}
                  </h1>
                  {item?.paragraph ? (
                    <p className="text-[25px] leading-[140%] max-[1025px]:text-center max-[450px]:text-left font-light mb-10 max-[450px]:mb-5 mt-2 pr-5 max-[1025px]:text-[30px] max-[450px]:text-[20px]">
                      {item?.paragraph}
                    </p>
                  ) : (
                    <div className="my-2"></div>
                  )}

                  {item.details.map((value, index) => {
                    return (
                      <span
                        key={index}
                        className="flex items-center max-[1025px]:justify-center max-[450px]:justify-start text-[22px] leading-[179%] font-light max-[1025px]:text-[25px] max-[450px]:text-[16px]"
                      >
                        <img
                          src="./star_icon.png"
                          alt="star/icon"
                          className="w-[16px] h-[16px] mr-2"
                        />
                        {value}
                      </span>
                    );
                  })}
                </div>
                {/* right side */}
                <div className="left w-[40%] h-[365px] min-[1600px]:h-[420px] flex justify-end max-[1025px]:justify-center overflow-hidden max-[1025px]:w-full max-[1025px]:h-[450px] max-[450px]:h-[300px]">
                  <img
                    src={item?.image}
                    alt="icon/layout"
                    className={`w-fit h-full bg-cover`}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Introduction;
