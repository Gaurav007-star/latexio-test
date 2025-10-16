import React, { useState } from "react";
import ReactPaginate from "react-paginate";
import Navbar from "@/components/Layout/Navbar";
import Topsection from "@/components/Layout/Topsection";
import Partners from "@/components/Layout/Partners";
import Footer from "@/components/Layout/Footer";

// icons
import { IoIosSearch } from "react-icons/io";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// images
import background from "../../assests/template.jpg";
import Img01 from "../../assests/Template/Templater-01.png";
import Img02 from "../../assests/Template/Templater-02.png";
import Img03 from "../../assests/Template/Templater-03.png";
import Img04 from "../../assests/Template/Templater-04.png";
import Img05 from "../../assests/Template/Templater-05.png";
import Img06 from "../../assests/Template/Templater-06.png";


const imageObject = (id, title, pic) => ({ id, title, pic });

const sequenceTemplate = [
  imageObject(1, "de Grau a l'EPS de la UIB (2025)", Img01),
  imageObject(2, "Example Project", Img02),
  imageObject(3, "Unofficial template - updated 2025", Img03),
  imageObject(4, "AltaCV Template", Img04),
  imageObject(5, "Proceedings Template", Img05),
  imageObject(6, "PhD Thesis Template", Img06),
  imageObject(37, "Unofficial template - updated 2025", Img03),
  imageObject(23, "PhD Thesis Template", Img06),
  imageObject(11, "Proceedings Template", Img05),
  imageObject(21, "AltaCV Template", Img04),
  imageObject(31, "Example Project ", Img02),
  imageObject(12, "Unofficial template - updated 2025", Img03),
  imageObject(22, "AltaCV Template", Img04),
  imageObject(16, "de Grau a l'EPS de la UIB (2025)", Img01)
];

const Template = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const postPerPage = 9;

  const lastPostIndex = currentPage * postPerPage;
  const firstPostIndex = lastPostIndex - postPerPage;

  const handlePageClick = ({ selected: page }) => {
    setCurrentPage(page + 1);
  };

  return (
    <div className="w-full h-max">
      {/* navbar */}
      <Navbar />

      {/* top-section */}
      <Topsection label={"Templates"} image={background} />

      {/* template main wrapper */}
      <div className="template-main-wrapper w-full h-max px-[10vw] max-[1025px]:px-[5vh]">
        {/* heading section */}
        <div className="heading-section w-full h-max text-left flex flex-col items-center gap-4 my-10 ">
          <h1 className="w-full h-max text-[60px] font-semibold ">
            Categories
          </h1>
          <p className="w-full h-max text-[25px] font-light ">
            Templates for journal articles, academic papers, CVs and résumés,
            presentations, and more.
          </p>
        </div>

        {/* search-section */}
        <div className="search-section w-full h-max flex items-center max-[450px]:flex-col gap-4 mb-10">
          <div className="input-section relative w-[40vw] max-[450px]:w-full max-[1025px]:w-[60vw] transform h-max rounded-4xl bg-red-300">
            <IoIosSearch className="text-[25px]  text-[#2C296F] absolute top-1/2 left-0 transform -translate-y-1/2 ml-3" />
            <Input
              type={"text"}
              placeholder={`Search project`}
              className={`w-full h-[7vh] max-[450px]:text-[18px] max-[1025px]:text-[25px] max-[1025px]:placeholder:text-[25px] max-[450px]:placeholder:text-[20px] top-0 left-0 rounded-4xl border-[#2C296F] m-0 pl-9 `}
            />
          </div>
          <Button
            className={`w-[130px] max-[450px]:w-full h-[7vh] text-center rounded-[40px] max-[1025px]:rounded-[30px]  text-[20px] `}
          >
            Search
          </Button>
        </div>

        {/* show-template-section */}
        <div className="template-section grid grid-cols-3 max-[1025px]:grid-cols-2 max-[450px]:grid-cols-1 w-full h-max justify-items-start gap-20 max-[1025px]:gap-10 max-[450px]:gap-5 mt-25 ">
          {sequenceTemplate
            .slice(firstPostIndex, lastPostIndex)
            .map((pic, i) => {
              return (
                <div className="template-box w-full h-max">
                  <img
                    key={i}
                    src={pic.pic}
                    alt="template/icon"
                    className="w-max h-fit object-cover"
                  />
                  <h1 className="w-full h-max text-center text-[20px] font-semibold py-5">
                    {pic.title}
                  </h1>
                </div>
              );
            })}
        </div>

        {/* pagination-sction */}
        <div className="pagenitation-section w-full h-[10vh] flex items-center justify-end my-10 max-[450px]:my-5 ">
          <ReactPaginate
            className="cursor-pointer w-full max-[450px]:w-full h-max flex justify-end gap-5 transition-transform duration-300 text-[23px] max-[450px]:text-[18px] font-medium"
            onPageChange={handlePageClick}
            previousLabel={
              currentPage === Math.ceil(sequenceTemplate.length / 9) - 1
                ? null
                : "< Previous"
            }
            nextLabel={
              currentPage === Math.ceil(sequenceTemplate.length / 9) - 1
                ? "Next >"
                : null
            }
            pageCount={
              sequenceTemplate.lenght < 9
                ? 1
                : Math.ceil(sequenceTemplate.length / 9)
            }
            marginPagesDisplayed={3}
            pageRangeDisplayed={1}
            pageClassName="hover:font-bold"
            previousClassName="text-secondary"
            nextClassName="text-secondary"
            activeClassName="text-secondary"
          />
        </div>
      </div>

      {/* Partners */}
      <Partners />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Template;
