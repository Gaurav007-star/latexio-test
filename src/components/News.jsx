import React from "react";
// import news from "../assests/news.svg";
import image01 from "../assests/latexTutorial/LatexTutorial01.jpg";
import image02 from "../assests/latexTutorial/LatexTutorial02.jpg";
import image03 from "../assests/latexTutorial/LatexTutorial03.jpg";
import image04 from "../assests/latexTutorial/LatexTutorial04.jpg";
import image05 from "../assests/latexTutorial/LatexTutorial05.jpg";
import image06 from "../assests/latexTutorial/LatexTutorial06.jpg";
import image07 from "../assests/latexTutorial/LatexTutorial07.jpg";

const LatexTutorial = [
  {
    image: image01,
    title: "How to Create Your First LaTeX Document"
  },
  {
    image: image02,
    title: "How to use Greek letters and math symbols"
  },
  {
    image: image03,
    title: "How to do drawing diagrams directly in LaTeX"
  },
  {
    image: image04,
    title: "How to do Positioning of Images and Tables"
  },
  {
    image: image05,
    title:
      "How to create cross-references for sections, equations, and floats in LaTeX"
  },
  {
    image: image06,
    title: "How to do multi-file LaTeX projects"
  },
  {
    image: image07,
    title: "How to create single-sided and double-sided documents"
  }
];

const News = () => {
  const arr = [...LatexTutorial, ...LatexTutorial];

  return (
    <div className="w-full h-max px-16 pt-20 overflow-x-hidden">
      {/* bullet point */}
      <li className="w-full h-max font-[600] text-[20px] tracking-[5px] mb-10">
        Latex Tutorial
      </li>

      {/* news-list-section */}
      <div className="flex items-center justify-start w-max overflow-hidden realtive h-max gap-10 mb-20 animate-scroll-right cursor-pointer">
        {arr.map((item, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2 w-[400px] h-max rounded-[20px] "
          >
            <img
              src={item?.image}
              alt="news"
              className="w-full h-[300px] object-cover object-center rounded-[20px] border-[1px]"
            />
            <div className="text-area w-full h-[70px] flex justify-start items-start">
              <h3 className="text-[16px] w-full font-semibold leading-tight py-2 px-1">
                {item?.title}
              </h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;
