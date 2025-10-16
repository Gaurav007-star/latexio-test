import phone from "../../assests/phone.svg";
import message from "../../assests/message.svg";
import map from "../../assests/map.svg";

import instagram from "../../assests/instagram.svg";
import StickyIcon from "../StickyIcon";
import { Link } from "react-router";

const aboutLinks = [
  {
    id: "About",
    links: [
      { link: "#", title: "About us" },
      { link: "#", title: "Our values" },
      { link: "#", title: "Careers" },
      { link: "#", title: "Blog" }
    ]
  },
  {
    id: "Learn",
    links: [
      { link: "#", title: "Tutorials" },
      { link: "#", title: "Insert images" },
      { link: "#", title: "Create tables" }
    ]
  },
  {
    id: "Plans",
    links: [
      { link: "#", title: "Standard" },
      { link: "#", title: "Professional" },
      { link: "#", title: "Premium" }
    ]
  },
  { id: "Help", links: [{ link: "#", title: "Contact us" }] }
];

const Footer = () => {
  return (
    <footer className="bg-primary text-white w-full pt-16 px-16 max-[1025px]:px-5 relative ">
      <div className="flex justify-between items-start max-[1025px]:flex-col w-full py-10 pb-20 px-16 max-[1025px]:py-5 max-[1025px]:gap-5">
        {/* Logo & Contact Info */}
        <div className="w-[30%] h-max flex flex-col gap-6 max-[1025px]:w-full max-[1025px]:items-center max-[1025px]:justify-center ">
          <img
            src="./Latexio_Logo_F_02.png"
            alt="logo"
            className="w-[250px] h-[50px] mb-5"
          />

          {/* phone */}
          <div className="flex items-center gap-4 text-white text-sm font-medium text-[18px] max-[1025px]:text-[20px] max-[395px]:text-[16px]">
            <img
              src={phone}
              alt="phone"
              className="w-[24px] h-[24px] max-[1025px]:hidden"
            />
            +91 9064822611
          </div>

          {/* email */}
          <div className="flex items-center gap-4 text-white text-sm font-medium text-[18px] max-[1025px]:text-[20px] max-[395px]:text-[16px]">
            <img
              src={message}
              alt="email"
              className="w-[24px] h-[24px] max-[1025px]:hidden"
            />
            info@latexio.com
          </div>

          {/* map */}
          <div className="w-[80%]  h-max max-[1025px]:justify-center max-[1025px]:text-center flex items-start gap-4 text-white text-sm font-medium text-[14px] max-[1025px]:text-[20px] max-[395px]:text-[16px]">
            <img
              src={map}
              alt="map"
              className="w-[24px] h-[24px] max-[1025px]:hidden"
            />
            Science & Technology Entrepreneurs’ Park (STEP), IIT Kharagpur,
            Kharagpur - 721302
          </div>
        </div>

        {/* Links Section */}
        <div className="w-[50%] max-[1300px]:w-[45%] h-max grid grid-cols-4 max-[1025px]:grid-cols-1 text-left max-[1025px]:text-center max-[1025px]:w-full max-[1025px]:gap-10">
          {/* about-section */}

          {aboutLinks.map((item, i) => {
            return (
              <div key={i}>
                <h3 className="font-semibold text-[25px] mb-6 mt-4 max-[1025px]:text-[30px] max-[395px]:text-[25px] ">
                  {item.id}
                </h3>
                <ul className="flex flex-col gap-2 text-[18px] max-[1025px]:text-[25px] max-[395px]:text-[20px] ">
                  {item.links.map((item, i) => (
                    <Link
                      to={item.link}
                      key={i}
                      className={`cursor-pointer hover:scale-105 hover:text-secondary transition-transform duration-200`}
                    >
                      {item.title}
                    </Link>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Social Icons */}
        <div className="w-[20%] max-[1300px]:w-[15%] h-max flex flex-col items-center gap-6 max-[1025px]:flex-row max-[1025px]:w-full max-[1025px]:justify-center max-[1025px]:mt-10">
          <div className="bg-[#F7755E] w-[48px] h-[48px] rounded-full flex items-center justify-center text-white text-xl font-bold">
            f
          </div>
          <div className="bg-[#F7755E] w-[48px] h-[48px] rounded-full flex items-center justify-center text-white text-xl font-bold">
            <img
              src={instagram}
              alt="insta/icon"
              className="w-[22px] h-22px]"
            />
          </div>
          <div className="bg-[#F7755E] w-[48px] h-[48px] rounded-full flex items-center justify-center text-white text-xl font-bold">
            in
          </div>
        </div>
      </div>

      {/* Up arrow */}
      <StickyIcon />

      {/* Bottom Section */}
      <div className="flex justify-center items-center text-[10px] gap-2 text-[#FFFFFF] pb-5 ">
        <span>© 2025 LaTexio</span>
        <a href="#" className="no-underline">
          Privacy and Terms
        </a>
        <a href="#" className="no-underline">
          Compliance
        </a>
      </div>
    </footer>
  );
};

export default Footer;
