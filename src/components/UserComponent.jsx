import React from "react";
import userIcon from "../assests/dashboardUser.svg";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { RxDashboard } from "react-icons/rx";
import { useNavigate } from "react-router";

const UserComponent = ({ ToggleHandler, Toggle, LogoutHAndler }) => {
  const navigate = useNavigate();

  return (
    <div>
      <div
        className={`${Toggle ? "block" : "hidden"} invisible-Wrapper absolute top-0 left-0 h-screen w-screen bg-transparent z-50`}
        onClick={() => ToggleHandler()}
      ></div>
      <img
        src={userIcon}
        alt="user/icon"
        className="w-[40px] h-[40px] cursor-pointer"
        onClick={ToggleHandler}
      />

      {Toggle && (
        <div className="user-profile-menu w-[150px] h-max absolute translate-y-0 right-10 flex flex-col gap-[10px] rounded-md p-4 bg-white shadow-md text-[14px] max-[1025px]:text-[16px] text-black transition-transform duration-200 z-50 max-[1025px]:bottom-54 max-[1025px]:top-20">
          <button className="w-full h-[40px] rounded-md hover:bg-slate-200/70 cursor-pointer flex items-center justify-start gap-[6px] px-2" onClick={()=>navigate("/profile")}>
            <IoSettingsOutline /> Profile
          </button>
          <button
            onClick={() => navigate("/dashboard")}
            className="w-full h-[40px] rounded-md hover:bg-slate-200/70 cursor-pointer flex items-center justify-start gap-[6px] px-2"
          >
            <RxDashboard /> Dashboard
          </button>
          <button
            className="w-full h-[40px] rounded-md hover:bg-slate-200/70 cursor-pointer flex items-center justify-start gap-[6px] px-2"
            onClick={LogoutHAndler}
          >
            <RiLogoutCircleLine /> Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserComponent;
