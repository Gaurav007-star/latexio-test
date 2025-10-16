import React, { useState, useRef, useEffect } from "react";
import arrow from "../assests/smallUpArrow.svg";
import { RiExternalLinkLine } from "react-icons/ri";

const DrawerDropdown = ({ label, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={dropdownRef}
      className=" w-full h-max relative flex flex-col text-left"
    >
      {/* Trigger */}
      <span
        className="w-full h-max flex items-center gap-4 cursor-pointer text-white text-[20px]"
        onClick={toggleDropdown}
      >
        {label}
        <img
          src={arrow}
          alt="arrow/icon"
          className="w-[20px] h-[20px] bg-cover rotate-180"
        />
      </span>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="w-full h-max flex flex-col items-center gap-4 pt-2">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="w-full h-max hover:scale-105 hover:translate-x-6 hover:rotate-1 py-2 flex items-center gap-2 rounded-md cursor-pointer max-[450px]:text-[16px] text-white hover:text-secondary transition duration-200 text-[20px]"
            >
              {item}
              <RiExternalLinkLine className="text-[20px] text-secondary" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DrawerDropdown;
