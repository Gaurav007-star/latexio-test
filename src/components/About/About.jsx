import React from "react";
import Navbar from "../../components/Layout/Navbar";
import Footer from "../../components/Layout/Footer";
import imgone from "../../assests/aboutIcon/Group 50.png";
import imgtwo from "../../assests/aboutIcon/Group 51.png";
import imagethree from "../../assests/aboutIcon/Group 52.png";
import imagefour from "../../assests/aboutIcon/Group 53.png";
import imagefive from "../../assests/aboutIcon/Group 54.png";
import imagesix from "../../assests/aboutIcon/Group 55.png";
import aboutTopImage from "../../assests/aboutIcon/aboutTopImage.png";
import background from "../../assests/background/about_background.png";
import Partners from "../../components/Layout/Partners";
import Topsection from "../../components/Layout/Topsection";

const About = () => {
  return (
    <div className="w-full h-max relative">
      {/* navbar */}
      <Navbar />

      {/* top-section */}
      <Topsection label={"Introduction"} image={background} />

      {/* middle-section */}
      <div className="middle-section w-full h-max flex max-[1025px]:flex-col">
        {/* image-section */}
        <div className="left-part w-[40%] p-[10vh] max-[450px]:p-5 max-[1025px]:w-full ">
          <img src={aboutTopImage} alt="icon/logo" />
        </div>

        {/* paragraph-text-details-section */}
        <div className="right-part w-[60%] py-[10vh] max-[450px]:p-5 pr-10 max-[1025px]:w-full max-[1025px]:px-[10vh] max-[1025px]:pt-0">
          {/* heading-section */}
          <h1 className="w-full h-max text-5xl text-[50px] font-semibold">
            The home of scientific and
            <br /> technical writing
          </h1>

          {/* paragraph-section */}
          <p className="w-full h-max text-[25px] font-light mt-6 text-[#212121] max-w-2xl">
            Latexio was developed by researchers to make scientific and
            technical writing simpler and more collaborative. There are many at
            research institutions and businesses around the world who love our
            platform because it helps them to write smarter and work together.
          </p>

          {/* user-document-countries */}
          <div className="mt-10 flex flex-col items-start w-full h-[30vh] max-[1025px]:h-[20vh] max-[450px]:h-[30vh]">
            {/* total-users */}
            <div className="w-full h-[50%] text-[60px] max-[450px]:text-[40px]">
              <h2 className=" font-semibold text-orange-500 ">3,000+</h2>
              <div className="w-full h-[0.3px]  bg-[#000000]"></div>
              <p className="uppercase text-[16px] font-semibold mt-1 tracking-widest">
                Latexio Users
              </p>
            </div>

            {/* document-country-section */}
            <div className="document-country-section w-full h-[50%] flex items-end text-[60px] max-[450px]:text-[40px] mt-5 ">
              {/* document */}
              <div className="document w-[50%] h-full mr-2">
                <div className="w-full h-max">
                  <h2 className="font-semibold w-full h-[80%] text-orange-500 border-b-[0.3px] border-[#000000]">
                    12k
                  </h2>
                  <p className="uppercase w-full h-[20%] text-[16px] max-[450px]:text-[14px] font-semibold tracking-widest ">
                    Documents Created
                  </p>
                </div>
              </div>

              {/* countries */}
              <div className="document w-[50%] h-full">
                <div className="w-full h-max">
                  <h2 className="font-semibold w-full h-[80%]  text-orange-500 border-b-[0.3px] border-[#000000]">
                    500
                  </h2>
                  <p className="uppercase w-full h-[20%] text-[16px] max-[450px]:text-[14px] font-semibold tracking-widest ">
                    Countries
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* bottom section */}
      <div className="bottom-section px-[10vh] max-[450px]:px-5 my-10 max-[450px]:mt-10 max-[450px]:mb-0">
        {/* heading-title */}
        <h1 className="w-full h-max text-[60px] font-semibold my-10  max-[1025px]:text-center max-[395px]:text-[40px] ">
          We aim to be...
        </h1>

        {/* icon sections */}
        <div className="icon-sections w-full h-max flex justify-between max-[1025px]:flex-col ">
          {/* section-one */}
          <div className="section-one w-[25vw] h-max flex flex-col max-[1025px]:flex-row max-[1025px]:justify-between max-[1025px]:w-full">
            {/* box-one */}
            <div className="box-one w-full h-[250px]  flex flex-col items-center max-[1025px]:w-[50%]">
              <img
                src={imgone}
                alt=""
                className="w-20 h-20 max-[395px]:w-15 max-[395px]:h-15"
              />
              <span className="text-[25px] text-center mt-5 max-[395px]:text-[15px]">
                Friendly, open, and
                <br />
                approachable
              </span>
            </div>

            {/* box-two */}
            <div className="box-two w-full h-[250px] flex flex-col items-center max-[1025px]:w-[50%] ">
              <img
                src={imgtwo}
                alt=""
                className="w-20 h-20 max-[395px]:w-15 max-[395px]:h-15"
              />
              <span className="text-[25px] text-center mt-5 max-[395px]:text-[15px]">
                Collaborative and
                <br />
                innovative
              </span>
            </div>
          </div>

          {/* section two */}
          <div className="section-one w-[25vw] h-max flex flex-col max-[1025px]:flex-row max-[1025px]:justify-between max-[1025px]:w-full items-center">
            {/* box-one */}
            <div className="box-one w-full h-[250px] flex flex-col items-center max-[1025px]:w-[50%] ">
              <img
                src={imagethree}
                alt=""
                className="w-20 h-20 max-[395px]:w-15 max-[395px]:h-15"
              />
              <span className="text-[25px] text-center mt-5 max-[395px]:text-[15px]">
                User centered
              </span>
            </div>

            {/* box-two */}
            <div className="box-two w-full h-[250px]  flex flex-col items-center max-[1025px]:w-[50%] ">
              <img
                src={imagefour}
                alt=""
                className="w-20 h-20 max-[395px]:w-15 max-[395px]:h-15"
              />
              <span className="text-[25px] text-center mt-5 w-full max-[395px]:text-[15px]">
                Sustainable, scalable
                <br />
                and reliable
              </span>
            </div>
          </div>

          {/* section three */}
          <div className="section-one w-[25vw] h-max flex flex-col max-[1025px]:flex-row max-[1025px]:justify-between max-[1025px]:w-full">
            {/* box-one */}
            <div className="box-one w-full h-[250px]  flex flex-col items-center max-[1025px]:w-[50%]">
              <img
                src={imagefive}
                alt=""
                className="w-20 h-20 max-[395px]:w-15 max-[395px]:h-15"
              />
              <span className="text-[25px] text-center mt-5 max-[395px]:text-[15px]">
                Trustworthy and
                <br />
                professional
              </span>
            </div>

            {/* box-two */}
            <div className="box-two w-full h-[250px]  flex flex-col items-center max-[1025px]:w-[50%]">
              <img
                src={imagesix}
                alt=""
                className="w-20 h-20 max-[395px]:w-15 max-[395px]:h-15"
              />
              <span className="text-[25px] text-center mt-5 max-[395px]:text-[15px]">
                Remote-first and
                <br />
                flexible
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* partners */}
      <Partners />

      {/* footer */}
      <Footer />
    </div>
  );
};

export default About;
