import React, { useState } from "react";
import smallArrow from "../../assests/smallUpArrow.svg";
import {useNavigate} from "react-router";
const plansDetails = [
  {
    id: 0,
    title: "Latexio Free",
    subTopics: [
      "Great for getting started",
      "Unlimited projects",
      "Only 1 collaborator"
    ]
  },
  {
    id: 1,
    title: "Small business",
    subTopics: [
      "Ideal for collaboration",
      "Access to integrations",
      "Real-time track changes"
    ]
  },
  {
    id: 2,
    title: "Organizations",
    subTopics: [
      "Teams who want to collaborate",
      "Security you can trust",
      "Cloud or on-premises solutions"
    ]
  }
];

const Plans = () => {
  const [isMoved, setMoved] = useState([true, false, false]);
  const navigate = useNavigate();
  const handleClick = (e) => {
    const newState = [false, false, false];

    if (e.target.id == 0) {
      newState[0] = true;
    }

    if (e.target.id == 1) {
      newState[1] = true;
    }

    if (e.target.id == 2) {
      newState[2] = true;
    }

    setMoved([...newState]);
  };

  return (
    <div className="w-full h-max bg-[#F5F5F5] px-16 max-[450px]:px-5 pt-16 overflow-hidden mt-10">
      {/* bullet point */}
      <li className="w-full h-max font-[600] text-[20px] tracking-wider max-[1025px]:text-center ">
        Plans & Pricing
      </li>

      {/* heading */}
      <h1 className="w-full h-max text-center text-[64px] max-[1025px]:text-[50px] font-bold tracking-[10px] max-[450px]:tracking-widest mt-5 mb-20 max-[1025px]:mb-10 max-[450px]:mb-0 max-[450px]:text-[30px]">
        WHAT WE OFFER
      </h1>

      {/* choose section for large-screen */}
      <div className="choose-section w-full h-max flex justify-center items-center max-[1025px]:items-center max-[1025px]:flex-col max-[1025px]:pb-10 gap-4 mt-10 relative max-[1025px]:hidden ">
        
        {/* comment:Plans-section */}
        {plansDetails.map((plan, i) => {
          return (
            <div
              key={i}
              className={`box-one relative left-0 w-[395px] h-[400px] rounded-t-4xl shadow-[0px_-4px_4px_#0000000D] bg-[#FFFFFF] flex flex-col items-center transition-transform duration-500 hover:cursor-pointer  ${
                isMoved[plan.id]
                  ? "animate-slide-up top-10"
                  : "top-30 max-[1025px]:top-0"
              }`}
            >
              <h1 className="text-[40px] w-full h-[150px] flex flex-col justify-end font-[600]  text-center">
                {plan.title}
              </h1>

              {/* comment:details-lists */}
              <div
                className={`details w-full h-[200px] text-wrap mb-4 flex flex-col justify-center items-center ${
                  plan.id == 2 ? "px-8" : "px-15"
                } ${isMoved[plan.id] ? "block" : "hidden"}`}
              >
                {/* sub-topics */}
                {plan.subTopics.map((item, i) => (
                  <span
                    key={i}
                    className="flex items-center w-full h-max text-[18px] leading-[179%] font-light"
                  >
                    <img
                      src="./star_icon.png"
                      alt="star/icon"
                      className="w-[16px] h-[16px] mr-2"
                    />
                    {item}
                  </span>
                ))}
              </div>

              {/* button - section */}
              <div
                className={`button flex items-start justify-center w-full h-[150px] ${
                  isMoved[plan.id] ? "block" : "hidden"
                }`}
              >
                <button className="w-[150px] h-[40px] rounded-4xl bg-secondary text-white cursor-pointer hover:scale-105 transition-transform duration-300" onClick={()=>navigate("/")}>
                  Explore
                </button>
              </div>

              {/* comment:after-close-button */}
              <div
                className={`button flex items-center justify-center w-full  h-max mt-20 ${
                  isMoved[plan.id] ? "hidden" : "block"
                }`}
                onClick={(e) => handleClick(e)}
              >
                <img
                  src={smallArrow}
                  id={plan.id}
                  alt="arrow/icon"
                  width={40}
                  height={40}
                  className={`${
                    isMoved[plan.id] ? "hidden" : "block"
                  } hover:translate-y-[-4px] hover:scale-105 transition-transform duration-200`}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* choose section for smaller screen */}
      <div className="choose-section w-full h-max flex items-center justify-center gap-10 max-[450px]:gap-4 flex-wrap my-10 p-[3vh] max-[450px]:p-2 min-[1025px]:hidden">
        {/* Plans */}
        {plansDetails.map((plan, i) => {
          return (
            <div
              key={i}
              className={`box relative left-0 w-full h-[500px] max-[450px]:h-[300px] rounded-4xl max-[450px]:rounded-2xl shadow-md bg-[#FFFFFF] flex flex-col  items-center transition-transform duration-500 hover:cursor-pointer`}
            >
              <h1 className="w-full h-[30%] flex justify-center items-center text-[50px] max-[450px]:text-[25px] font-semibold">
                {plan.title}
              </h1>

              {/* details-lists */}
              <div
                className={`details w-full h-[40%] flex flex-col items-center justify-start`}
              >
                {/* sub-topics */}
                {plan.subTopics.map((item, i) => (
                  <p
                    key={i}
                    className="flex justify-center items-center w-full h-max text-[30px] max-[450px]:text-[16px] leading-[179%] font-light"
                  >
                    <img
                      src="./star_icon.png"
                      alt="star/icon"
                      className="w-[16px] h-[16px] mr-2"
                    />
                    {item}
                  </p>
                ))}
              </div>

              {/* button - section */}
              <div
                className={`button flex items-center justify-center w-full h-[30%] `}
              >
                <button className="w-[50%] h-[7vh] max-[450px]:h-[50%] rounded-full bg-secondary text-[30px] max-[450px]:text-[16px] text-white cursor-pointer">
                  Explore
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Plans;
