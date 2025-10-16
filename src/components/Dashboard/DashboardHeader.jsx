import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import userIcon from "../../assests/dashboardUser.svg";
import exclametory from "../../assests/exclametory.svg";
import { MdKeyboardArrowDown } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { RiLogoutCircleLine } from "react-icons/ri";
import { HiMenu } from "react-icons/hi";
import DrawerDropdown from "../DrawerDropdown";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import { headerLinks } from "@/constants/constants";
import UserComponent from "../UserComponent";

const DashboardHeader = () => {
  const [userMenu, setUserMenu] = useState(false);
  const drawerCheckboxRef = useRef(null);
  const navigate = useNavigate();

  const { logout } = useAuth();

  const userMenuHandler = () => {
    setUserMenu((prev) => !prev);
  };

  const LogoutHAndler = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    // Close user menu when screen crosses 1024px breakpoint
    const mediaQuery = window.matchMedia("(max-width: 1024px)");

    const handleMediaChange = (e) => {
      if (e.matches) {
        setUserMenu(false);
      }
    };

    mediaQuery.addEventListener("change", handleMediaChange);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handleMediaChange);
    };
  }, []);

  return (
    <div className="navbar w-full h-max border-b-2 border-[#D9D9D9] px-10 py-5 flex justify-between items-center max-[1025px]:justify-between">
      {/* left part */}
      <img
        src="./Latexio_Logo_F_01.svg"
        alt="logo"
        className="object-cover w-[10%] h-full max-[1025px]:w-[20%] max-[450px]:w-[40%] cursor-pointer"
        onClick={() => navigate("/")}
      />

      {/* middle part */}
      <div className="middle-part hidden w-[40%] max-[1025px]:w-max h-max items-center justify-center gap-[10px] text-[18px] max-[500px]:gap-[6px] max-[500px]:text-[12px] max-[450px]:hidden">
        <h1 className="flex items-center">
          You're on the{" "}
          <span className="text-secondary mr-2 ml-1">free plan</span>
          <img
            src={exclametory}
            alt="icon"
            className="h-[20px] w-[20px] max-[500px]:h-[16px] max-[500px]:w-[16px] bg-cover"
          />
        </h1>
        <button className="btn bg-primary text-white rounded-4xl font-medium text-[14px] px-[10px] py-[4px] max-[500px]:text-[12px]">
          upgrade
        </button>
      </div>

      {/* right part */}
      <div className="right-part w-[50%] max-[1025px]:w-max h-max flex items-center ">
        {/* desktop nav */}
        <div className="right-side relative w-full flex items-center justify-end gap-[20px] text-black max-[1025px]:hidden">
          {headerLinks.map((item, i) => {
            return (
              <Link
                key={i}
                to={item.link}
                className="text-[16px] hover:scale-105 transition-transform duration-200"
              >
                {item.title}
              </Link>
            );
          })}
          <UserComponent
            ToggleHandler={userMenuHandler}
            Toggle={userMenu}
            LogoutHAndler={LogoutHAndler}
          />
        </div>


        {/* mobile menu icon */}
        <div className="right-menu-side w-full h-max  min-[1025px]:hidden">
          <label htmlFor="my-drawer" className="cursor-pointer">
            <HiMenu className="text-secondary text-[40px] max-[500px]:text-[30px]" />
          </label>
        </div>

        {/* mobile sidebar drawer */}
        <div className="drawer w-full min-[1025px]:hidden flex">
          <input
            id="my-drawer"
            type="checkbox"
            className="drawer-toggle"
            ref={drawerCheckboxRef}
            onChange={(e) => {
              if (e.target.checked) {
                setUserMenu(false);
              }
            }}
          />
          <div className="drawer-content" />
          <div className="drawer-side">
            <label
              htmlFor="my-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            />
            <ul className="menu relative bg-primary text-secondary space-y-4 min-h-full w-80 p-10">
              <DrawerDropdown
                label={"Freatures & Benefits"}
                items={["Asd", "fsdfsd", "grerge"]}
              />
              <Link
                to={"#"}
                className="text-[20px] max-[450px]:text-[16px] py-2 flex items-center gap-2 rounded-md hover:scale-105 hover:translate-x-6 hover:rotate-1 text-white hover:text-secondary transition duration-200"
              >
                Templates
              </Link>
              <Link
                to={"#"}
                className="text-[20px] max-[450px]:text-[16px] py-2 flex items-center gap-2 rounded-md hover:scale-105 hover:translate-x-6 hover:rotate-1 text-white hover:text-secondary transition duration-200"
              >
                Plans & Pricing
              </Link>
              <Link
                to={"#"}
                className="text-[20px] max-[450px]:text-[16px] py-2 flex items-center gap-2 rounded-md hover:scale-105 hover:translate-x-6 hover:rotate-1 text-white hover:text-secondary transition duration-200"
              >
                Contact us
              </Link>

              {/* user icon drop up section */}
              <div className="dropdown dropdown-top absolute bottom-10">
                <img
                  tabIndex={0}
                  src={userIcon}
                  alt="user/icon"
                  className="w-[50px] h-[50px] cursor-pointer"
                />

                <ul
                  tabIndex={0}
                  className="dropdown-content user-profile-menu w-[150px] h-max max-[450px]:top-[-25vh] max-[1025px]:top-[-17vh] absolute flex flex-col gap-[10px] rounded-md p-4 bg-secondary text-[14px] max-[1025px]:text-[16px] text-white transition-transform duration-200 z-50 max-[1025px]:bottom-54 max-[1025px]:left-10"
                >
                  <button className="w-full h-[40px] rounded-md hover:bg-primary hover:text-white flex items-center justify-center gap-[6px] ">
                    <IoSettingsOutline /> Setting
                  </button>
                  <button
                    className="w-full h-[40px] rounded-md hover:bg-primary hover:text-white flex items-center justify-center gap-[6px] "
                    onClick={LogoutHAndler}
                  >
                    <RiLogoutCircleLine /> Logout
                  </button>
                  <button className="w-full h-[40px] rounded-md hover:bg-primary hover:text-white flex items-center justify-center gap-[6px] ">
                    <MdOutlineTipsAndUpdates /> Update
                  </button>
                </ul>
              </div>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
