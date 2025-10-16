import React, { useEffect, useState } from "react";
import Background from "../../assests/home/homeBackground.jpg";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

const Hero = () => {
  const [userEmail, setUserEmail] = useState("");
  const navigate = useNavigate();

  const tryForFreeHandler = e => {
    e.preventDefault();
    if (!userEmail) {
      toast.error("enter your email please");
      return;
    }
    localStorage.setItem("user-email", userEmail);
    navigate("/signup");
  };

  return (
    <div className="top-section w-full h-[714px] min-[1600px]:h-[900px] flex bg-dark">
      
      {/* top-left */}
      <div className="top-left flex flex-col justify-between w-[40%] h-full pl-10 max-[1025px]:px-10 max-[1025px]:w-full pt-5 ">
        <div className="header-section flex flex-col justify-end max-[1025px]:items-center max-[1025px]:justify-center max-[1025px]:pb-0 max-[1025px]:pt-30 w-full h-[65%] text-[40px]  font-medium text-white pb-20">
          <h1 className="w-full h-max max-[1025px]:text-center max-[1025px]:text-[50px] max-[450px]:text-[35px]">
            The intuitive, collaborative
          </h1>

          <h2 className="font-bold w-full h-max max-[1025px]:text-center max-[1025px]:text-[40px]">
            <span className="text-secondary">LaTeX</span> editor for everyone.
          </h2>
        </div>

        <form className="w-full h-[35%] flex gap-2 max-[1025px]:justify-center max-[450px]:flex-col ">
          <input
            type="email"
            id="email"
            name="emial"
            placeholder="Email"
            className="w-[359px] max-[450px]:w-full h-[50px] rounded-4xl outline-none text-white border-1 border-secondary pl-4"
            onChange={e => setUserEmail(e.target.value)}
            value={userEmail}
          />
          <button
            className="bg-secondary w-[180px] max-[450px]:w-full h-[50px] rounded-4xl text-white cursor-pointer text-[16px] hover:scale-95 transition-transform duration-200"
            onClick={tryForFreeHandler}
          >
            Try for free
          </button>
        </form>
      </div>

      {/* top-right */}
      <div className="top-right w-[60%] h-full max-[1025px]:hidden">
        {/* background image */}
        <img src={Background} alt="tab" className="w-full h-full bg-cover " />
      </div>
    </div>
  );
};

export default Hero;
