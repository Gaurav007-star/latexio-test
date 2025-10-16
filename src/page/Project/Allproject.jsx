import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { PiDotsThreeOutlineVerticalFill } from "react-icons/pi";
import toast from "react-hot-toast";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { RiDeleteBin2Line } from "react-icons/ri";
import { PiShareNetworkLight } from "react-icons/pi";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { MdOutlineCopyAll } from "react-icons/md";
import { GoFileZip } from "react-icons/go";
import { BsFileEarmarkPdf } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { useAuth } from "@/context/AuthContext";
import { Link, useNavigate } from "react-router";
import projectIcon from "../../assests/projectIcon.png";


// PROPS: projects, loading, searchTerm, minHeight, pageSize, onPageChange, currentPage, totalCount
const Allproject = ({
  projects = [],
  loading = false,
  searchTerm = "",
  minHeight = 400,
  pageSize = 10,
  // onPageChange,
  // currentPage = 1,
  totalCount = 0
}) => {
  const [checkAction, setCheckAction] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });
  };

  // single check box --> handler
  const handleCheckOptions = (e, project) => {
    if (e.target.checked) {
      setCheckAction((prev) => [...prev, project]);
    } else {
      setCheckAction((prev) => prev.filter((item) => item._id !== project._id));
    }
  };

  // on click select function --> handler for mobile
  const handleClickProject = (project) => {
    const status = checkAction.some((item) => item._id === project._id);
    if (!status) {
      setCheckAction((prev) => [...prev, project]);
    } else {
      setCheckAction((prev) => prev.filter((item) => item._id !== project._id));
    }
  };

  useEffect(() => {
    setSelectAll(
      checkAction.length > 0 && checkAction.length === projects.length
    );
  }, [checkAction, projects.length]);

  // if we select all project --> handler
  const selectAllHandler = (event) => {
    if (event.target.checked) {
      setSelectAll(true);
      setCheckAction([...projects]);
    } else {
      setSelectAll(false);
      setCheckAction([]);
    }
  };

  const GotoEditorPageHandler = (id) => {
    navigate(`/editor/${id}`);
  };

  // PAGINATION: slice projects for current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProjects = projects.slice(startIndex, endIndex);

  // Pagination info
  const showingFrom = currentProjects.length === 0 ? 0 : startIndex + 1;
  const showingTo = Math.min(endIndex, totalCount || projects.length);

  // LONG PRESS HANDLER FOR SELECT
  const longPressHandler = (project) => {
    const timeout = setTimeout(() => {
      handleClickProject(project);
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  };

  return (
    <div className="w-full h-max text-center relative" style={{ minHeight }}>
      {/* loading state */}
      {loading ? (
        <div className="w-full h-[80vh] overflow-x-auto overflow-y-hidden px-[10vw] mb-10 my-10">
          {Array.from({ length: pageSize }).map((_, id) => (
            <Skeleton
              key={id}
              className="h-[8vh] my-2 w-full rounded-xl bg-slate-200"
            />
          ))}
        </div>
      ) : (
        <>
          {/* hover-menu-section */}
          {checkAction.length > 0 && (
            <div className="absolute top-[-10vh]  max-[1025px]:top-[-7px] max-[1025px]:right-15 max-[450px]:right-0 max-[1025px]:w-fit menu-section w-full h-max px-[10vw] max-[1025px]:px-5 flex items-center justify-end z-20">
              <div className="delete-share-archive w-max bg-primary animate-menu-in transition-transform duration-200 text-white h-max flex items-center justify-between rounded-md">
                <div className="box-one w-[60px] max-[450px]:w-[50px] h-[7vh] rounded-tl-md rounded-bl-md flex items-center justify-center hover:bg-secondary hover:text-primary cursor-pointer">
                  <HiOutlineArchiveBox size={20} />
                </div>
                <div className="box-one w-[60px] max-[450px]:w-[50px] h-[7vh] flex items-center justify-center hover:bg-secondary hover:text-primary cursor-pointer">
                  <PiShareNetworkLight size={20} />
                </div>
                <div className="box-one w-[60px] max-[450px]:w-[50px] h-[7vh] rounded-br-md rounded-tr-md flex items-center justify-center hover:bg-secondary hover:text-primary cursor-pointer">
                  <RiDeleteBin2Line size={20} />
                </div>
              </div>
            </div>
          )}

          {/* table-section */}
          <div className="w-full h-max px-[10vw] max-[450px]:px-5  mb-10 max-[1025px]:mb-0 mt-15 max-[1025px]:mt-5">
            {/* table format for large screen  */}
            <table className="table table-lg max-[1025px]:hidden">
              <tr className="text-white">
                <th className="rounded-tl-[10px] bg-primary justify-center w-[50px] h-full">
                  <label className="flex items-center gap-2 cursor-pointer ">
                    <input
                      type="checkbox"
                      className="hidden peer"
                      checked={selectAll}
                      onChange={selectAllHandler}
                    />
                    <div className="w-[16px] h-[16px] border-[1px] border-white rounded-[3px] peer-checked:bg-shadow peer-checked:after:content-['-'] peer-checked:after:text-black peer-checked:after:text-xs flex items-center justify-center transition-all duration-200"></div>
                  </label>
                </th>
                <th className="text-left text-[18px] font-medium  bg-primary ">
                  Title
                </th>
                <th className="text-center text-[18px] font-medium bg-primary ">
                  Owner
                </th>
                <th className="text-center text-[18px] font-medium bg-primary ">
                  Last Modification
                </th>
                <th className="text-center text-[18px] font-medium rounded-tr-[10px] bg-primary ">
                  Actions
                </th>
              </tr>

              <tbody className="space-y-4 ">
                {currentProjects.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-8">
                      No projects found.
                    </td>
                  </tr>
                ) : (
                  currentProjects.map((project) => (
                    <tr
                      key={project._id}
                      className={`text-center space-y-2 ${
                        checkAction.some((item) => item._id === project._id)
                          ? "bg-shadow text-black"
                          : ""
                      } cursor-pointer`}
                    >
                      <th className="check-box flex items-center justify-center">
                        <label>
                          <input
                            type="checkbox"
                            className="hidden peer"
                            onChange={(e) => handleCheckOptions(e, project)}
                            checked={checkAction.some(
                              (item) => item._id === project._id
                            )}
                          />
                          <div className="w-[16px] h-[16px] border-[1px] border-black peer-checked:bg-transparent peer-checked:after:content-['✓'] peer-checked:after:text-black peer-checked:after:text-xs flex items-center justify-center transition-all duration-200"></div>
                        </label>
                      </th>
                      <td className="text-left">
                        <Link
                          to={`/editor/${project._id}`}
                          className={` ${
                            checkAction.some((item) => item._id === project._id)
                              ? ""
                              : "hover:text-secondary"
                          } cursor-pointer `}
                        >
                          {project.title}
                        </Link>
                      </td>
                      <td>{project?.projectType}</td>
                      <td>{formatDate(project?.last_accessed)}</td>
                      <td className="three-dot flex items-center justify-center">
                        <div
                          className={`dropdown dropdown-start ${
                            project._id === projects[projects.length - 1]?._id
                              ? "dropdown-top"
                              : "dropdown-start"
                          }`}
                        >
                          <div tabIndex={0} className="cursor-pointer">
                            <PiDotsThreeOutlineVerticalFill className="text-[16px]" />
                          </div>
                          <ul
                            tabIndex={0}
                            className={`dropdown-content menu bg-white rounded-box z-20 w-40 p-2 translate-x-4 text-black shadow-md `}
                          >
                            <li>
                              <a>
                                <MdOutlineCopyAll />
                                Copy
                              </a>
                            </li>
                            <li>
                              <a>
                                <GoFileZip />
                                Download zip
                              </a>
                            </li>
                            <li>
                              <a>
                                <BsFileEarmarkPdf />
                                Download pdf
                              </a>
                            </li>
                            <li>
                              <a>
                                <HiOutlineArchiveBox />
                                Archived
                              </a>
                            </li>
                            <li>
                              <a>
                                <RiDeleteBin2Line />
                                Delete
                              </a>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>

            {/* MOBILE SCREEN RESPONSIVE */}
            <div
              className={`small-table-div w-full h-max flex flex-col gap-2 mb-10 mt-10 min-[1025px]:hidden `}
              style={{ minHeight }}
            >
              <div className="check-box w-full h-max flex items-center pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="hidden peer"
                    id="select"
                    checked={selectAll}
                    onChange={selectAllHandler}
                  />
                  <div className="w-[30px] h-[30px] max-[450px]:w-[20px] max-[450px]:h-[20px] rounded-[5px] border-2 border-black peer-checked:bg-shadow peer-checked:after:content-['✓'] peer-checked:after:text-black peer-checked:after:text-lg max-[450px]:peer-checked:after:text-sm flex items-center justify-center transition-all duration-200"></div>
                  <span className="text-[25px] max-[450px]:text-[20px] font-medium">
                    Select all
                  </span>
                </label>
              </div>

              {currentProjects.length === 0 ? (
                <div className="w-full text-center text-gray-500 p-6">
                  No projects found.
                </div>
              ) : (
                currentProjects.map((project) => (
                  <div
                    key={project._id}
                    className={`project-box w-full h-max flex items-center justify-between px-2 py-4 rounded-md border-2 border-shade ${
                      checkAction.some((item) => item._id === project._id)
                        ? "bg-shadow text-black "
                        : ""
                    } cursor-pointer`}
                  >
                    <img src={projectIcon} alt="" className="w-7 h-7"/>
                    <div
                      onTouchStart={() => longPressHandler(project)}
                      onClick={() => GotoEditorPageHandler(project?._id)}
                      className="left w-[80%] px-2 h-max flex flex-col text-left justify-center"
                    >
                      <h1 className="text-[28px] max-[450px]:text-[18px] flex gap-2 items-center">
                        {project.title}
                      </h1>
                      <p className="max-[450px]:text-[14px] text-[24px]">
                        {formatDate(project.created_at)} <br />{" "}
                        {/* <span>Owned by {project.owner}</span> */}
                      </p>
                    </div>
                    <div
                      className={`dropdown ${
                        project._id === projects[projects.length - 1]?._id
                          ? "dropdown-top"
                          : "dropdown-start"
                      } w-[10%] h-max`}
                    >
                      <div
                        tabIndex={0}
                        className="cursor-pointer z-20"
                      >
                        <IoSettingsOutline className="max-[450px]:text-[20px] max-[1025px]:text-[28px]" />
                      </div>
                      <ul
                        tabIndex={0}
                        className="dropdown-content menu bg-white rounded-box z-20 w-40 max-[1025px]:w-40 p-2  translate-x-4  max-[1025px]:translate-x-[-100px] top-[25px] max-[1025px]:top-[30px] max-[1025px]:border-2 border-primary text-black shadow-sm "
                      >
                        <li>
                          <a>
                            <MdOutlineCopyAll />
                            Copy
                          </a>
                        </li>
                        <li>
                          <a>
                            <GoFileZip />
                            Download zip
                          </a>
                        </li>
                        <li>
                          <a>
                            <BsFileEarmarkPdf />
                            Download pdf
                          </a>
                        </li>
                        <li>
                          <a>
                            <HiOutlineArchiveBox />
                            Archived
                          </a>
                        </li>
                        <li>
                          <a>
                            <RiDeleteBin2Line />
                            Delete
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* pagination-section */}
          <div className="pagenitation-section flex items-center w-full h-[10vh] px-[10vw] my-10 max-[450px]:my-5">
            <h1 className="w-[30%] h-max flex text-left text-[18px] max-[1025px]:text-[16px] max-[450px]:hidden font-normal tracking-wider">
              {`Showing ${showingFrom} to ${showingTo} of ${
                totalCount || projects.length
              } entries`}
            </h1>
            <div className="w-[70%] max-[450px]:w-full flex justify-end">
              <ReactPaginate
                containerClassName="flex gap-2"
                pageClassName="px-2"
                activeClassName="text-black font-bold"
                previousClassName="text-black"
                nextClassName="text-black"
                breakLabel="..."
                previousLabel="< Previous"
                nextLabel="Next >"
                pageCount={Math.ceil(
                  (totalCount || projects.length) / pageSize
                )}
                forcePage={currentPage - 1}
                marginPagesDisplayed={1}
                pageRangeDisplayed={2}
                onPageChange={(e) => setCurrentPage(e.selected + 1)}
                disabledClassName="opacity-50"
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Allproject;
