import React from "react";
import { Link } from "react-router-dom";

const Dropdown = ({ label, link, items }) => {
  return (
    <div className="relative text-left group hover:scale-110 transition-transform duration-200">
      {/* Trigger */}
      <Link to={link} className="">
        <span className="cursor-pointer text-white hover:scale-105 transition-all duration-200">
          {label}
        </span>
      </Link>

      {/* Dropdown Panel */}
      {/* <div
        className="absolute left-0 mt-4 w-[180px] px-3 py-2 bg-dark text-white rounded-md z-10 
                      opacity-0 scale-95 -translate-y-2 
                      transition-all duration-200 ease-in-out 
                      group-hover:opacity-100 group-hover:scale-100 group-hover:translate-x-2
                      pointer-events-auto"
      >
        <ul className="py-1 w-full flex flex-col gap-4 justify-center">
          {items.map((item, idx) => (
            <li
              key={idx}
              className="w-full rounded-md cursor-pointer text-[16px] hover:text-secondary transition duration-200 flex items-center justify-start"
            >
              <a href={link}>{item}</a>
            </li>
          ))}
        </ul>
      </div> */}
    </div>
  );
};

export default Dropdown;
