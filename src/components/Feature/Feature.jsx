import Navbar from "@/components/Layout/Navbar";
import Topsection from "@/components/Layout/Topsection";
import React from "react";
import featureBackground from "../../assests/feature/featureBackground.jpg";
import Introduction from "@/components/Layout/Introduction";
import Partners from "@/components/Layout/Partners";
import News from "@/components/News";
import Footer from "@/components/Layout/Footer";
import { features } from "@/constants/constants";
import TopImage from "../../assests/feature/topImage.png";
import { useNavigate } from "react-router";

const plans = [
  {
    tag: "Free LaTeXio",
    subTopics: [
      "Great for getting started",
      "Unlimited projects",
      "Only 1 collaborator"
    ],
    btn_tag: "Explore"
  },
  {
    tag: "Small business",
    subTopics: [
      "Ideal for collaboration",
      "Access to integrations",
      "Real-time track changes"
    ],
    btn_tag: "Explore"
  },
  {
    tag: "Organizations",
    subTopics: ["Team collaboration", "Trusted security", "Cloud or on-prem"],
    btn_tag: "Explore"
  }
];

const topSectionData = {
  image:TopImage,
  title:"Effortless precision for fast, smart scientific and technical writing.",
  desc:"LaTeX editor for research and technical teams, offering both secure cloud-based and on-premises deployment options."
}

const Feature = () => {

  const navigate = useNavigate();

  return (
    <div className="w-full h-max">
      {/* navbar */}
      <Navbar />

      {/* top-section */}
      <Topsection label={"For Business"} image={featureBackground}  />

      {/* introduction */}
      <Introduction listData={features} topSectionData={topSectionData} btn={{link:"/pricing",label:"Explore plans"}}/>

      {/* plans */}
      <div className="plans-container w-full h-max flex flex-col items-center px-[10vh] max-[1025px]:px-[5vh] my-10">
        <h1 className="w-full h-max text-left font-semibold text-[60px] max-[1025px]:text-center max-[1025px]:text-[50px]">
          Plans to fit your needs
        </h1>

        {/* All-plans-section */}
        <div className="plans-section w-full h-max flex justify-between max-[1025px]:flex-col max-[1025px]:items-center gap-4 mt-10 mb-20">
          {plans.map((item, i) => {
            return (
              <div
                key={i}
                className="plan-box w-[375px] max-[1025px]:w-[80%] max-[450px]:w-full h-max flex flex-col gap-6 py-8 px-4 border border-slate-500"
              >
                <h2 className="w-full h-max text-[28px] max-[1025px]:text-[30px] font-semibold">
                  {item.tag}
                </h2>
                <div className="w-full h-max flex flex-col items-center justify-center gap-3 font-light text-[20px] max-[1025px]:text-[25px] max-[450px]:text-[16px]">
                  {item.subTopics.map((item, i) => (
                    <p key={i} className="flex items-center w-full h-max ">
                      <img
                        src="./star_icon.png"
                        alt="star/icon"
                        className="w-[16px] h-[16px] mr-2"
                      />
                      {item}
                    </p>
                  ))}
                </div>
                <button onClick={()=>navigate("/pricing")} className="w-full h-max flex items-center mt-5 mb-2 px-4 cursor-pointer hover:scale-95 transition-transform duration-200 ">
                  <span className="w-full h-[50px] bg-secondary text-white flex justify-center items-center rounded-full">
                    {item.btn_tag}
                  </span>
                </button>
              </div>
            );
          })}
        </div>

        {/* plans-bottom-heading-part */}
        <div className="bottom-heading-part w-full h-max px-[10vh] max-[1025px]:px-[5vh] text-[32px] max-[1025px]:text-[28px] mb-10">
          <h1 className="w-full h-max text-center ">
            Don't see the right fit for you?
          </h1>
          <h4 className="w-full h-max text-center">
            <span className="text-secondary font-semibold"> contact Sales</span>
          </h4>
        </div>
      </div>

      {/* partners */}
      <Partners />

      {/* news */}
      <News />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default Feature;
