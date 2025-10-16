import Topsection from "@/components/Layout/Topsection";
import React from "react";
import background from "../../assests/contactBackground.jpg";
import Navbar from "@/components/Layout/Navbar";
import homemap from "../../assests/homemap.svg";
import phone from "../../assests/lanphone.svg";
import email from "../../assests/email.svg";
import Partners from "@/components/Layout/Partners";
import News from "@/components/News";
import Footer from "@/components/Layout/Footer";

const details = [
  {
    id: 1,
    img: homemap,
    tag: "Location",
    desc: "Science & Technology Entrepreneurs Park (STEP), IIT Kharagpur, Kharagpur - 721302"
  },
  {
    id: 2,
    img: phone,
    tag: "Phone No.",
    desc: "+91 9064822611"
  },
  {
    id: 3,
    img: email,
    tag: "E-mail",
    desc: "info@latexio.com"
  }
];

const Contact = () => {
  return (
    <div className="w-full h-max ">
      {/* navbar */}
      <Navbar />

      {/* top-section */}
      <Topsection label={"Contact us"} image={background} />

      {/* heading-details-section */}
      <div className="heading-detail-message-section w-full h-max px-[10vh] max-[450px]:px-[5vh] mb-10">
        {/* heading-section */}
        <div className="heading-section w-full h-max pt-20 text-[55px] max-[1025px]:text-[40px] max-[450px]:text-[25px] font-semibold text-left max-[1025px]:text-center">
          <h1>If there is anything to</h1>
          <h2>
            talk about,{" "}
            <span className="text-secondary">
              please feel free to contact us.
            </span>
          </h2>
        </div>

        {/* location-phone-email */}
        <div className="details-section w-full h-max flex items-start max-[1025px]:flex-col ">
          {details.map((item, i) => {
            return (
              <div
                key={i}
                className={`detail-box w-[35%] max-[1025px]:w-full h-[250px] flex flex-col justify-start max-[1025px]:items-center max-[1025px]:justify-center gap-6 max-[1025px]:gap-4 ${
                  item.id == 3
                    ? "border-none"
                    : "border-r-[1px] max-[1025px]:border-b-[1px] max-[1025px]:border-r-0"
                } border-black p-8 max-[450px]:p-4 my-20 max-[1025px]:my-5 `}
              >
                <img
                  src={item.img}
                  alt="icon"
                  className="w-[50px] h-[50px] max-[450px]:w-[40px] max-[450px]:h-[40px] bg-cover"
                />
                <h1 className="w-full h-max font-semibold text-[35px] max-[450px]:text-[20px] text-left max-[1025px]:text-center">
                  {item.tag}
                </h1>
                <p
                  className={`w-full h-max font-light text-[20px] max-[1025px]:text-center max-[1025px]:text-[25px] max-[450px]:text-[20px] ${
                    item.tag === "Location" ? "max-[1025px]:pb-2" : ""
                  }`}
                >
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* message-section */}
        <div className="message-section w-full h-max flex items-start border-t-[1px] py-[10vh] max-[1025px]:py-[5vh] border-black max-[1025px]:flex-col">
          {/* left-side */}
          <div className="left-side w-[35%] max-[1025px]:w-full h-max">
            <h1 className="w-[70%] max-[1025px]:w-full max-[1025px]:text-center h-max text-[55px] max-[450px]:text-[30px] font-semibold leading-[107%]">
              Leave a message
            </h1>
          </div>

          {/* right-side */}
          <div className="right-side w-[65%] max-[1025px]:w-full h-max max-[1025px]:mt-10 bg-[#F5F5F5] rounded-md flex flex-col gap-4 px-[15vh] max-[1025px]:px-[5vh] py-10 ">
            <h1 className="w-full h-max text-center text-[24px] max-[450px]:text-[16px] mb-5">
              Fill all information details to consult with us to get services
              from us
            </h1>

            {/* username-section */}
            <input
              type="text"
              placeholder="Name"
              className="w-full h-[60px] text-[20px] border-b-2 border-b-[#CFD8DC] outline-none "
            />

            {/* email-phone-input */}
            <div className="email-phone w-full h-max flex justify-between gap-8">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="E-mail"
                className="w-[50%] h-[60px] text-[20px] outline-none border-b-2 border-b-[#CFD8DC]"
              />
              <input
                type="text"
                name="phone"
                id="phone"
                placeholder="Phone"
                className="w-[50%] h-[60px] text-[20px] outline-none border-b-2 border-b-[#CFD8DC]"
              />
            </div>

            {/* Industry-section */}
            <input
              type="text"
              placeholder="Organisation"
              className="w-full h-[60px] text-[20px] border-b-2 border-b-[#CFD8DC] outline-none "
            />

            {/* message-textarea */}
            <textarea
              placeholder="Message"
              className="outline-none border-b-2 border-b-[#CFD8DC] h-[20vh] text-[20px]"
            />

            {/* button - section */}
            <div
              className={`button flex items-center justify-start w-full h-max mt-10 max-[450px]:mt-10`}
            >
              <button className="w-[150px] px-4 py-2 text-[20px] rounded-4xl bg-secondary text-white cursor-pointer hover:scale-105 transition-transform duration-200">
                Submit
              </button>
            </div>
          </div>
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

export default Contact;
