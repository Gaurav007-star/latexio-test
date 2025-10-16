import React, { useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { MdOutlineTipsAndUpdates } from "react-icons/md";
import { RiLogoutCircleLine } from "react-icons/ri";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router";

const inputButtons = (
  id,
  title,
  name,
  inputType,
  placeholder,
  Handler,
  value
) => ({
  id,
  title,
  name,
  inputType,
  placeholder,
  Handler,
  value
});

const UserSettings = () => {
  const [userData, setUserData] = useState({
    password: "",
    conformPassword: "",
    userName: ""
  });

  const InputHandler = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const { logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () =>{
    logout();
    navigate("/");
  }

  // INPUT ARRAY
  const inputDetails = [
    inputButtons(
      1,
      "Username",
      "userName",
      "Username",
      "Username",
      InputHandler,
      userData.userName
    ),
    inputButtons(
      2,
      "Password",
      "password",
      "password",
      "Password",
      InputHandler,
      userData.password
    ),
    inputButtons(
      3,
      "Conform Password",
      "conformPassword",
      "password",
      "Conform Password",
      InputHandler,
      userData.conformPassword
    )
  ];

  return (
    <div className="w-full h-full p-6 max-[450px]:p-2 border-l-2">
      <div className="top-header">
        <h1 className="text-[40px] font-semibold text-primary mb-6">
          Settings
        </h1>
      </div>

      {/* PASSWORD UPDATE SECTION */}
      <div className="password-section flex flex-col items-center w-full">
        {inputDetails.slice(0, 1).map((item) => (
          <div key={item.id} className="flex flex-col gap-1 w-full">
            <label className="text-sm text-gray-700">{item.title}</label>
            <Input
              type={item.inputType}
              name={item.name}
              placeholder={item.placeholder}
              value={item.value}
              onChange={item.Handler}
              className="w-full h-[52px] rounded-md px-3 border border-[#E9E6F3] focus:border-secondary outline-none"
            />
          </div>
        ))}

        <div className="update-button w-full h-max flex justify-end mt-4 max-[450px]:mb-4">
          <button
            className={`h-[52px] max-[450px]:h-[40px] px-6 text-[18px] rounded-full flex items-center gap-1 bg-icon hover:bg-primary hover:scale-105 transition-transform duration-200 text-white cursor-pointer`}
          >
            Update <MdOutlineTipsAndUpdates className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* USER NAME UPDATE SECTION */}
      <div className="username-section flex flex-col items-center w-full ">
        {inputDetails.slice(1).map((item) => (
          <div key={item.id} className="flex flex-col gap-1 w-full">
            <label className="text-sm text-gray-700">{item.title}</label>
            <Input
              type={item.inputType}
              name={item.name}
              placeholder={item.placeholder}
              value={item.value}
              onChange={item.Handler}
              className="w-full h-[52px] rounded-md px-3 border border-[#E9E6F3] focus:border-secondary outline-none"
            />
          </div>
        ))}

        <div className="update-button w-full h-max flex justify-end mt-4 max-[450px]:mb-4">
          <button
            className={`h-[52px] max-[450px]:h-[40px] px-6 text-[18px] rounded-full flex items-center gap-1 bg-icon hover:bg-primary hover:scale-105 transition-transform duration-200 text-white cursor-pointer`}
          >
            Update <MdOutlineTipsAndUpdates className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="update-button w-full h-max flex max-[450px]:flex-col justify-start mt-4 gap-4">
        <Button className={`h-[52px] !px-6 text-[18px] rounded-full`} onClick={logoutHandler}>
          <RiLogoutCircleLine className="w-5 h-5" />
          Logout
        </Button>
        <Button
          className={`h-[52px] px-6 text-[18px] rounded-full bg-shade text-icon hover:text-white`}
        >
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default UserSettings;
