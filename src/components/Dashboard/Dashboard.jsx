import React, { useEffect, useState, useMemo } from "react";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
  Outlet
} from "react-router-dom";
import DashboardHeader from "./DashboardHeader";
import fileIcon from "../../assests/newFile.svg";
import { IoIosSearch } from "react-icons/io";
import { PiProjectorScreenChart } from "react-icons/pi";
import { RiUserLine } from "react-icons/ri";
import { PiShareNetworkLight } from "react-icons/pi";
import { HiOutlineArchiveBox } from "react-icons/hi2";
import { RiDeleteBin2Line } from "react-icons/ri";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import Footer from "../Layout/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Allproject from "../../page/Project/Allproject";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { apiFetch } from "@/api/apiFetch";
import toast from "react-hot-toast";
import { Helmet } from "react-helmet";
import { useAuth } from "@/context/AuthContext";

const createLink = (id, link, tag, Icon, meta) => ({
  id,
  link,
  tag,
  Icon,
  meta
});

const links = [
  createLink(1, "/dashboard", "All projects", PiProjectorScreenChart, {
    title: "Dashboard | All Projects | Latexio - The IIT KGP LaTeX Editor",
    description: "Manage all your LaTeX projects with Latexio Dashboard."
  }),
  createLink(2, "/dashboard/userproject", "Your projects", RiUserLine, {
    title: "Dashboard | Your Projects | Latexio - The IIT KGP LaTeX Editor",
    description: "View and manage your own LaTeX projects."
  }),
  createLink(3, "/dashboard/shared", "Shared", PiShareNetworkLight, {
    title: "Dashboard | Shared Projects | Latexio - The IIT KGP LaTeX Editor",
    description: "Access projects shared with you on Latexio."
  }),
  createLink(4, "/dashboard/archived", "Archived", HiOutlineArchiveBox, {
    title: "Dashboard | Archived Projects | Latexio - The IIT KGP LaTeX Editor",
    description: "Review your archived LaTeX projects."
  }),
  createLink(5, "/dashboard/trashed", "Trashed", RiDeleteBin2Line, {
    title: "Dashboard | Trashed Projects | Latexio - The IIT KGP LaTeX Editor",
    description: "Manage your trashed LaTeX projects."
  })
];

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // const auth = useAuth();
  const [loading, setLoading] = useState(false);

  const [projectDetails, setProjectDetails] = useState({
    title: "",
    description: "Write a Latex project description",
    template: "Blank",
    projectType: "public"
  });

  // Search input state
  const [searchTerm, setSearchTerm] = useState("");
  // Projects state
  const [allProjects, setAllProjects] = useState([]);
  const [projectsLoading, setProjectsLoading] = useState(false);

  // Determine active tab (route)
  const activeLinkObj =
    links.find((l) => l.link === location.pathname) || links[0];

  // Fetch projects based on tab
  useEffect(() => {
    let endpoint = "/project/all";
    if (location.pathname === "/dashboard/userproject")
      endpoint = "/project/user";
    if (location.pathname === "/dashboard/shared") endpoint = "/project/shared";
    if (location.pathname === "/dashboard/archived")
      endpoint = "/project/archived";
    if (location.pathname === "/dashboard/trashed")
      endpoint = "/project/trashed";

    setProjectsLoading(true);
    apiFetch(endpoint, { method: "GET" })
      .then((res) => {
        setAllProjects(res.projects || []);
      })
      .catch(() => {
        // toast.error("Failed to fetch projects");
        setAllProjects([]);
      })
      .finally(() => setProjectsLoading(false));
  }, [location.pathname]);

  // Filtered projects for search
  const filteredProjects = useMemo(() => {
    if (!searchTerm) return allProjects;
    return allProjects.filter((proj) =>
      proj.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allProjects, searchTerm]);

  // Handle search input
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Modal form handlers
  const ProjectSubmitHandler = async () => {
    try {
      if (!projectDetails.title) {
        toast.error("Title is required.");
        return;
      }
      setLoading(true);
      const response = await apiFetch("/project/create", {
        method: "POST",
        body: projectDetails
      });
      setLoading(false);
      toast.success("Project added successfully!");
      navigate(`/editor/${response.projectId}`);
    } catch {
      toast.error("Failed to add project. Please try again.");
      setLoading(false);
    }
  };

  const InputHandler = (e) => {
    setProjectDetails({ ...projectDetails, [e.target.name]: e.target.value });
  };

  // -- Helmet meta for dynamic tab --
  const metaTitle = activeLinkObj.meta.title;
  const metaDesc = activeLinkObj.meta.description;

  // Set default tab on load (All Projects)
  useEffect(() => {
    if (
      location.pathname === "/dashboard" ||
      !links.some((l) => l.link === location.pathname)
    ) {
      navigate("/dashboard", { replace: true });
    }
    // eslint-disable-next-line
  }, []);

  return (
    <div className="dashboard-container w-screen h-max">
      <Helmet>
        <meta charSet="UTF-8" />
        <title>{metaTitle}</title>
        <meta name="description" content={metaDesc} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Helmet>

      {/* navbar */}
      <DashboardHeader />

      {/* modal for create project */}
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box w-[27vw] max-[1025px]:w-[90%] bg-[#F5F5F5] text-white">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost text-primary absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h1 className="w-full h-max text-primary text-4xl text-left font-bold">
            Create Project
          </h1>

          {/* Input-field section */}
          <div className="input-section w-full h-max mt-5">
            <Input
              type={"text"}
              placeholder="Enter title of the project"
              className={`h-10 border-black`}
              name="title"
              onChange={InputHandler}
              value={projectDetails.title}
            />

            {/* button-section */}
            <div className="button-section w-full flex justify-end gap-4 my-4">
              <form method="dialog" className="w-[30%] h-max">
                <Button
                  className={`w-full h-[6vh] bg-secondary hover:bg-secondary hover:scale-105 transition-transform duration-200 rounded-full`}
                  onClick
                >
                  Close
                </Button>
              </form>

              <Button
                onClick={ProjectSubmitHandler}
                className={`w-[30%] h-[6vh] rounded-full hover:scale-105 transition-transform duration-200`}
              >
                {loading ? (
                  <span className="animate-ping">...</span>
                ) : (
                  "Create+"
                )}
              </Button>
            </div>
          </div>
        </div>
      </dialog>

      {/* link-section */}
      <div className="link-section w-full h-max flex justify-center py-10 ">
        <div className="link-header w-[70%] max-[1025px]:w-full max-[1025px]:px-20 max-[450px]:px-5 h-max flex items-center justify-between rounded-[10px] gap-1 text-[18px] max-[1300px]:text-[16px]">
          {/* link new project */}
          <button
            onClick={() => document.getElementById("my_modal_3").showModal()}
            className="link no-underline w-[20%] max-[1025px]:w-[50%] h-[60px] max-[450px]:h-[50px] flex max-[1025px]:shrink-0 items-center justify-center bg-secondary text-white rounded-tl-[10px] rounded-bl-[10px] gap-2 "
          >
            <img
              src={fileIcon}
              alt="file/icon"
              className="w-[18px] h-max bg-cover"
            />
            <span className="">New Project</span>
          </button>

          {/* Drop-down section for mobile responsive */}
          <DropdownMenu>
            <DropdownMenuTrigger className="max-[1025px]:w-[50%] max-[1025px]:h-[60px] max-[450px]:h-[50px] max-[1025px]:rounded-r-[10px] bg-primary flex items-center justify-center text-[18px]  text-white min-[1025px]:hidden gap-2">
              Menu <ChevronDownIcon className="size-6" />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className={`max-[450px]:w-full max-[1025px]:w-[300px] h-max bg-primary text-white`}
            >
              {links.map((item) => (
                <Link to={item.link} key={item.link}>
                  <DropdownMenuItem
                    className={`flex items-center gap-2 max-[450px]:py-2 max-[1025px]:py-4 max-[450px]:text-[16px] max-[1025px]:text-[20px] ${
                      location.pathname === item.link
                        ? "bg-secondary text-white"
                        : ""
                    }`}
                  >
                    <item.Icon className="text-xl" />
                    {item.tag}
                  </DropdownMenuItem>
                </Link>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* nav links */}
          {links.map((item) => (
            <NavLink
              to={item.link}
              key={item.link}
              className={`${
                location.pathname == item.link
                  ? "text-primary border-primary border-b-4"
                  : "bg-[#F5F5F5]"
              } link no-underline w-[20%] h-[60px] max-[450px]:h-[50px] ${
                item.id == 5 ? "rounded-r-[10px]" : ""
              } flex items-center justify-center max-[1025px]:hidden`}
            >
              <item.Icon className="text-[20px] max-[450px]:text-4xl max-[1025px]:text-5xl max-[1025px]:p-2 mr-1 max-[1025px]:m-0" />
              <span className="max-[1025px]:hidden">{item.tag}</span>
            </NavLink>
          ))}
        </div>
      </div>

      {/* search-section */}
      <div className="search-section w-full h-max flex justify-center items-center mt-5">
        <div className="input-section relative w-[40vw] max-[1025px]:w-[60vw] transform h-max rounded-4xl bg-red-300">
          <IoIosSearch className="text-[25px]  text-[#2C296F] absolute top-1/2 left-0 transform -translate-y-1/2 ml-3" />
          <Input
            type={"text"}
            placeholder={`Search Projects`}
            value={searchTerm}
            onChange={handleSearchChange}
            className={`w-full h-[7vh] max-[450px]:text-[18px] max-[1025px]:text-[25px] max-[1025px]:placeholder:text-[25px] max-[450px]:placeholder:text-[20px] top-0 left-0 rounded-4xl border-[#2C296F] m-0 pl-10 `}
          />
        </div>
      </div>

      {/* Project list section */}
      <div className="w-full flex flex-col items-center">
        <div className="w-[100%] min-h-[400px]">
          {location.pathname.startsWith("/dashboard") && (
            <Allproject
              loading={projectsLoading}
              projects={filteredProjects}
              searchTerm={searchTerm}
              minHeight={400}
            />
          )}
        </div>
      </div>

      {/* outlet section */}
      <Outlet />

      {/* footer-section */}
      <Footer />
    </div>
  );
};

export default Dashboard;
