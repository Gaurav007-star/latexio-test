import React, { useEffect, useState } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import university01 from "../../assests/partners/curtinUniversity.png";
import university02 from "../../assests/university_02.svg";
import university03 from "../../assests/university_03.svg";
import university04 from "../../assests/university_04.svg";
import user01 from "../../assests/partners/partner01.png";
import user02 from "../../assests/partners/partner02.png";
import user03 from "../../assests/partners/partner03.svg";

// demo testimonials
const testimonials = [
  {
    id: 1,
    answer: `Latexio has completely streamlined my LaTeX workflow. It's clean, intuitive, and perfect for both quick edits and large academic projects.`,
    user: "Deep Dutta",
    occupation: "Programmer"
  },
  {
    id: 2,
    answer: `This platform has completely transformed the way I manage my projects. The interface is clean, intuitive, and incredibly fast.`,
    user: "Ayesha Khan",
    occupation: "Product Designer"
  },
  {
    id: 3,
    answer: `Using this service has significantly improved team collaboration. I highly recommend it to anyone working remotely.`,
    user: "Ravi Patel",
    occupation: "Team Lead"
  },
  {
    id: 4,
    answer: `I've tried many tools before, but nothing comes close to the ease of use and features this one offers. Absolutely love it!`,
    user: "Emily Rogers",
    occupation: "Marketing Manager"
  },
  {
    id: 5,
    answer: `Exceptional customer support and frequent updates keep this tool ahead of the curve. It's now essential to my daily workflow.`,
    user: "Carlos Mendoza",
    occupation: "Freelance Developer"
  },
  {
    id: 6,
    answer: `From managing tasks to tracking deadlines, everything just works smoothly. Kudos to the team behind this!`,
    user: "Sakura Tanaka",
    occupation: "Project Coordinator"
  }
];

const Partners = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(
        prev => (prev === testimonials.length - 1 ? 0 : prev + 1)
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTestimonial = testimonials[currentIndex];

  return (
    <div className="w-full h-max bg-[#F5F5F5] px-16 max-[450px]:px-10 pt-16">
      {/* bullet point */}
      <li className="w-full h-max font-[600] text-[20px] tracking-[5px] mb-10">
        Our Partners
      </li>

      {/* testimonial */}
      <div className="w-full h-max flex items-start my-20 max-[450px]:my-5 max-[1025px]:flex-col">
        {/* Left Section: Delighted Users */}
        <div className="w-[30%] h-full max-[1025px]:w-full ">
          <h2 className="text-[40px] max-[1025px]:text-[50px] font-bold text-gray-900 leading-[50px]">
            Great Ideas
          </h2>

          {/* user-icon-section */}
          <div className="flex items-center mt-6 space-x-1">
            {[user01,user02,user03].map((img, i) =>
              <div
                key={i}
                className="w-[60px] h-[60px] max-[1025px]:w-[70px] max-[1025px]:h-[70px] bg-[#A9B9C8] rounded-full"
              >
                <img
                  src={img}
                  alt="user/icon"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="w-[60px] h-[60px] max-[1025px]:w-[70px] max-[1025px]:h-[70px] bg-[#FF7A59] rounded-full flex items-center justify-center text-white text-xl font-bold">
              +
            </div>
          </div>

          <p className="text-sm max-[1025px]:text-[25px] text-gray-600 mt-2 ">
            More than 25k+ happy clients
          </p>
        </div>

        {/* Right Section: User Testimonial */}
        <div className="w-[70%] h-full flex flex-col items-center justify-center max-[1025px]:w-full max-[1025px]:mt-7">
          {/* animate section */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-[35px] max-[450px]:text-[20px] font-medium text-gray-800 mb-6 leading-[140%]">
                “{currentTestimonial.answer}”
              </p>
            </motion.div>

            {/* Pagination dots */}
          </AnimatePresence>

          {/* user details section */}
          <div className="bottom-section w-full h-max flex items-center justify-between ">
            {/* user-details */}
            <div className="user-names w-max h-[50px] flex items-center justify-between ">
              <div className="w-max h-max">
                <p className="font-semibold max-[450px]:text-[14px] text-gray-900">
                  {currentTestimonial.user}
                </p>
                <p className="text-sm max-[450px]:text-[14px] text-gray-600">
                  {currentTestimonial.occupation}
                </p>
              </div>
            </div>

            <span className="border-1 border-[#D9D9D9] w-[60%] max-[450px]:w-[50px] max-[450px]:mr-2 " />

            {/* dot-section */}
            <div className="w-max h-max flex items-center space-x-2 bg-[#FFFFFF] shadow-[0px_0px_4px_0px_#0000000D] p-2 rounded-4xl">
              {testimonials.map((_, index) =>
                <span
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2.5 h-2.5 rounded-full cursor-pointer ${index ===
                  currentIndex
                    ? "bg-secondary"
                    : "bg-gray-300"}`}
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* image-section */}
      <div className="image-section-container w-full h-max flex items-start justify-center pt-10 pb-30 gap-4 max-[1025px]:flex-wrap ">
        {[
          university01,
          university02,
          university03,
          university04
        ].map((src, i) =>
          <div
            key={i}
            className="image-container w-[258px] h-[258px] bg-[#FFFFFF] border-1 border-[#CFD8DC] rounded-[40px] flex justify-center items-center object-cover"
          >
            <img
              src={src}
              alt="university/icon"
              className="w-[152px] h-[162px]"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Partners;
