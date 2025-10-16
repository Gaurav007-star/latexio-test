import React from "react";

const Topsection = ({image,label}) => {
  return (
    <div className="top-section w-full h-[600px] min-[1600px]:h-[900px] relative overflow-hidden">
      <h1 className="bg-transparent absolute top-[40%] w-full flex justify-center text-white text-[65px] max-[450px]:text-[40px] text-center font-bold">
        {label}
      </h1>
      <img
        src={image}
        alt="background/img"
        className="w-full h-full object-cover "
      />
    </div>
  );
};

export default Topsection;
