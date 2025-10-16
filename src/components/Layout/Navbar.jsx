import React, { useState } from "react";
import Dropdown from "../Dropdown";
import { HiMenu } from "react-icons/hi";
import DrawerDropdown from "../DrawerDropdown";
import { Link, useNavigate, } from "react-router";
import { Button } from "../ui/button";
import { useAuth } from "@/context/AuthContext";
import UserComponent from "../UserComponent";

const Navbar = () => {
  const [openId, setOpenId] = useState(null);
  const [toggle, setToggle] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="nav-bar w-full h-max absolute left-0 right-0 flex items-center justify-between z-50 px-10 py-10 max-[450px]:px-10">
      {/* logo */}
      <Link to={"/"} className="flex items-center w-max">
        <img
          src="./Latexio_Logo_F_02.png"
          alt="logo"
          className="w-[380px] max-[450px]:w-[400px] h-auto max-[450px]:h-auto"
        />
      </Link>

      {/* menu icon */}
      <label
        htmlFor="my-drawer"
        className="absolute right-20 max-[450px]:right-10 rounded-md cursor-pointer hidden max-[1025px]:block"
      >
        <HiMenu className="text-secondary text-6xl max-[450px]:text-4xl " />
      </label>

      {/* drop-down menu */}
      <div className="drawer w-full flex">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">{/* Page content here */}</div>
        <div className="drawer-side">
          <label
            htmlFor="my-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu relative bg-primary text-secondary space-y-4 min-h-full w-80 p-10 ">
            {/* dropdown - link */}
            <DrawerDropdown
              label={"Freatures & Benefits"}
              items={["Asd", "fsdfsd", "grerge"]}
            />

            {/* template link */}
            <Link
              to={"/template"}
              className="w-max h-max hover:scale-105 hover:translate-x-6 hover:rotate-1 py-2 flex items-center gap-2 rounded-md cursor-pointer max-[450px]:text-[16px] text-white hover:text-secondary transition duration-200 text-[20px]"
            >
              Templates
            </Link>

            {/* plans link */}
            <Link
              to={"#"}
              className="w-max h-max hover:scale-105 hover:translate-x-6 hover:rotate-1 py-2 flex items-center gap-2 rounded-md cursor-pointer max-[450px]:text-[16px] text-white hover:text-secondary transition duration-200 text-[20px]"
            >
              Plans & Pricing
            </Link>

            {/* contact link */}
            <Link
              to={"#"}
              className="w-max h-max hover:scale-105 hover:translate-x-6 hover:rotate-1 py-2 flex items-center gap-2 rounded-md cursor-pointer max-[450px]:text-[16px] text-white hover:text-secondary transition duration-200 text-[20px]"
            >
              Contact us
            </Link>

            {/* <Link to={"/login"}>
              <Button
                className={`login-btn absolute w-60 h-[7vh] bg-secondary bottom-10 cursor-pointer`}
              >
                Login
              </Button>
            </Link> */}
          </ul>
        </div>
      </div>

      {/* navbar - section */}
      <div className="navbar w-[60%] h-max flex absolute top-8 right-10 justify-end items-center gap-6 text-white max-[1025px]:hidden">
        <Dropdown
          label="Freatures & Benefits"
          id="features"
          link="/feature"
          openId={openId}
          setOpenId={setOpenId}
          // items={[
          //   "For business",
          //   "For universities",
          //   "For goverment",
          //   "For publishers"
          // ]}
        />
        <Dropdown
          label="Templates"
          id="templates"
          link="/template"
          openId={openId}
          setOpenId={setOpenId}
          // items={[
          //   "For business",
          //   "For universities",
          //   "For goverment",
          //   "For publishers"
          // ]}
        />
        {/* <Dropdown
          label="Plans & Pricing"
          id="Plans"
          link="/plans"
          openId={openId}
          setOpenId={setOpenId}
          items={[
            "For business",
            "For universities",
            "For goverment",
            "For publishers"
          ]}
        /> */}

        <Dropdown label={"Plans & Pricing"} link={"/pricing"} />

        <Dropdown
          label="Contact us"
          id="contact"
          link="/contact"
          openId={openId}
          setOpenId={setOpenId}
          // items={[
          //   "For business",
          //   "For universities",
          //   "For goverment",
          //   "For publishers"
          // ]}
        />



          {/* Login button section */}

        {/* {user ? (
          <UserComponent
            LogoutHAndler={logoutHandler}
            Toggle={toggle}
            ToggleHandler={() => setToggle((prev) => !prev)}
          />
        ) : (
          <Link to={`${user ? "/dashboard" : "/login"}`}>
            <button
              className={`bg-secondary  rounded-4xl cursor-pointer hover:scale-105 transition-transform duration-200 ${
                user ? "w-[130px] h-[40px]" : "w-[100px] h-[40px]"
              } `}
            >
              Log in
            </button>
          </Link>
        )} */}
      </div>
    </div>
  );
};

export default Navbar;
