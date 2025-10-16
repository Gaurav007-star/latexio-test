import { useAuth } from "@/context/AuthContext";
import React, { useEffect, useState } from "react";
import { CgProfile } from "react-icons/cg";
import {
  RiDeleteBin2Line,
  RiSettings4Line,
  RiDashboardHorizontalLine,
} from "react-icons/ri";

import UserProfile from "./UserProfile";
import { Spinner } from "../ui/kibo-ui/spinner";
import { useLocation, useNavigate } from "react-router";
import DashboardHeader from "../Dashboard/DashboardHeader";
import Footer from "../Layout/Footer";
import UserSettings from "./UserSettings";
import { MdOutlineArrowBackIosNew } from "react-icons/md";
import { cn } from "@/lib/utils";
import userProfileImage from "../../assests/profile.png";
import { Button } from "../ui/button";
import DialogModal from "../Dialog/DialogAIGen";
import { Edit2Icon, SquarePenIcon } from "lucide-react";
import { apiFetch } from "@/api/apiFetch";
import toast from "react-hot-toast";
import clsx from "clsx";

const projects = [
  {
    id: 1,
    date: "March 05, 2024",
    name: "Thesis Formatting",
  },
  {
    id: 2,
    date: "March 08, 2024",
    name: "Beamer Presentation",
  },
  {
    id: 3,
    date: "March 12, 2024",
    name: "CV/Resume Template",
  },
  {
    id: 4,
    date: "April 10, 2024",
    name: "Calculus Funda",
  },
];

const FetchApiData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const success = true; // simulate success/failure

      if (success) {
        resolve("Data resolved");
      } else {
        reject("Error fetching data!");
      }
    }, 5000); // 1 second delay
  });
};

const leftLinks = [
  {
    id: "profile",
    title: "Profile",
    Icon: CgProfile,
  },
  {
    id: "dashboard",
    title: "Dashboard",
    Icon: RiDashboardHorizontalLine,
  },

  {
    id: "settings",
    title: "Settings",
    Icon: RiSettings4Line,
  },
];

// LINK BUTTON COMPONENT
const LinkButton = ({
  id,
  title,
  Icon,
  setLink,
  selectedBtn,
  sidebarClose,
}) => {
  return (
    <button
      className={clsx(
        `hover:bg-primary  w-full h-max hover:text-white text-icon rounded-full flex items-center gap-1 cursor-pointer transition-transform duration-200 group`,
        selectedBtn ? "border-shadow border-2 text-icon" : "",
        sidebarClose ? "max-[450px]:p-0 border-none" : "p-4 max-[450px]:p-2"
      )}
      onClick={() => setLink(id)}
    >
      <Icon
        className={clsx(
          "group-hover:translate-x-2 transition-transform duration-200 text-2xl",
          selectedBtn ? "text-secondary" : ""
        )}
      />
      <span
        className={cn(
          "group-hover:translate-x-2 transition-transform duration-200",
          sidebarClose ? "hidden" : ""
        )}
      >
        {title}
      </span>
    </button>
  );
};

// IMAGE UPLOADER HANDLER
const ImageUploader = ({closeHandler}) => {
  const { user , getNewUserDetails} = useAuth();

  const [image, setImage] = useState(null);

  const UploadImageHandler = (e) => {
    setImage(e.target.files[0]);
  };

  // IMAGE UPLOADER HANDLER
  const SubmitImageHandler = async () => {
    if (!image) {
      toast.error("Please select an image");
      return;
    }

    if (!user?._id) {
      toast.error("User not found");
      return;
    }

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("profilePicture", image);

      // CALL API HERE
      const data = await apiFetch(`/auth/uploadprofilepicture/${user._id}`, {
        method: "POST",
        body: formData,
        // headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("response data", data);
      toast.success("Profile picture updated successfully!");
      await getNewUserDetails();
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Failed to upload image");
    } finally {
      setImage(null);
      closeHandler();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <label
        htmlFor="file"
        className="h-[300px] w-full flex flex-col items-center justify-center gap-5 cursor-pointer border-2 border-dashed border-primary bg-white p-2 rounded-lg shadow-[0px_48px_35px_-48px_rgba(0,0,0,0.1)]"
      >
        {image ? (
          <img
            src={URL.createObjectURL(image)}
            className="object-cover object-center w-full h-full"
          />
        ) : (
          <>
            <div className="flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 fill-icon"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M10 1C9.73478 1 9.48043 1.10536 9.29289 1.29289L3.29289 7.29289C3.10536 7.48043 3 7.73478 3 8V20C3 21.6569 4.34315 23 6 23H7C7.55228 23 8 22.5523 8 22C8 21.4477 7.55228 21 7 21H6C5.44772 21 5 20.5523 5 20V9H10C10.5523 9 11 8.55228 11 8V3H18C18.5523 3 19 3.44772 19 4V9C19 9.55228 19.4477 10 20 10C20.5523 10 21 9.55228 21 9V4C21 2.34315 19.6569 1 18 1H10ZM9 7H6.41421L9 4.41421V7ZM14 15.5C14 14.1193 15.1193 13 16.5 13C17.8807 13 19 14.1193 19 15.5V16V17H20C21.1046 17 22 17.8954 22 19C22 20.1046 21.1046 21 20 21H13C11.8954 21 11 20.1046 11 19C11 17.8954 11.8954 17 13 17H14V16V15.5ZM16.5 11C14.142 11 12.2076 12.8136 12.0156 15.122C10.2825 15.5606 9 17.1305 9 19C9 21.2091 10.7909 23 13 23H20C22.2091 23 24 21.2091 24 19C24 17.1305 22.7175 15.5606 20.9844 15.122C20.7924 12.8136 18.858 11 16.5 11Z"
                />
              </svg>
            </div>
            <div className="flex items-center justify-center">
              <span className="font-normal text-gray-600">
                Click to upload image
              </span>
            </div>
          </>
        )}
        <input
          type="file"
          id="file"
          className="hidden"
          onChange={UploadImageHandler}
        />
      </label>
      <div className="submit-button-section w-full h-max mt-4">
        <Button
          className={cn(`!px-6 h-[52px] w-full text-[18px] rounded-full `)}
          onClick={SubmitImageHandler}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

const Profile = () => {
  const { user, logout, isLoading, token } = useAuth();
  const [selectedLink, setLink] = useState("profile");
  // const [fetchProjects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !token) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [isLoading, token, navigate, location]);

  // HANDLE PAGE ROUTING
  const renderRightSection = () => {
    if (loading) {
      return (
        <div className="flex justify-center items-center h-[600px] w-full  text-primary">
          <Spinner size={40} className={`text-primary`} />
          Loading...
        </div>
      );
    }

    switch (selectedLink) {
      case "profile":
        return <UserProfile />;
      case "settings":
        return <UserSettings />;
      case "dashboard":
        return navigate("/dashboard");
      default:
        return <div>Select a section</div>;
    }
  };

  const LogoutHandler = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const [sidebarClose, setSidebar] = useState(false);

  useEffect(() => {
    function updateState() {
      if (window.innerWidth > 1025) {
        setSidebar(false); // force close on large screens
      }
    }

    window.addEventListener("resize", updateState);

    // call once on mount to ensure correct initial state
    updateState();

    return () => window.removeEventListener("resize", updateState);
  }, []);

  // IMAGE MODAL STATE TOGGLER
  const [modal, setModal] = useState(false);

  // Only profile Dashboard if authenticated
  if (!token && !isLoading) return null;

  return (
    <div className="h-max w-full bg-white">
      {/* HEADER SECTION*/}
      <DashboardHeader />

      <div className="flex w-full h-max gap-2 max-[450px]:gap-1 p-4 max-[450px]:p-1">
        {/* LEFT SECTION - USER DETAILS */}
        <div
          className={cn(
            `left-section w-[20%] h-[600px] flex flex-col justify-between rounded-md `,
            sidebarClose ? "w-[10%]" : "max-[450px]:w-[40%]"
          )}
        >
          <div className="top-section flex flex-col items-center w-full h-max rounded-md p-4 max-[450px]:p-2">
            {/* TOP ICON SECTION */}
            <div className="icon-section w-full justify-end hidden max-[450px]:flex">
              <MdOutlineArrowBackIosNew
                className={cn(
                  "w-5 h-5 ",
                  sidebarClose
                    ? "rotate-180 transition-transform duration-200"
                    : " transition-transform duration-200"
                )}
                onClick={() => setSidebar((prev) => !prev)}
              />
            </div>

            {/* User Info */}
            <div className="w-full  h-max flex max-[450px]:flex-col justify-start items-center max-[450px]:items-start gap-4 mb-4">
              <div className="avatar ">
                <div
                  className={cn(
                    `ring-primary relative group ring-offset-base-100 rounded-full ring ring-offset-2`,
                    sidebarClose ? "w-8 max-[400px]:w-6 mt-5" : "w-15"
                  )}
                >
                  <img
                    src={
                      user?.profilePicture
                        ? `https://api-iit-kgp-latex.demome.in${user.profilePicture}`
                        : userProfileImage
                    }
                    className="group-hover:opacity-70"
                  />
                  <div
                    className="absolute top-0 left-0 bg-black/50 w-full h-full rounded-full z-50 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    onClick={() => setModal(true)}
                  >
                    <SquarePenIcon className="text-white text-xl" />
                  </div>
                </div>
              </div>
              <div className="w-full h-max">
                {!sidebarClose && (
                  <>
                    <h2 className="text-lg font-semibold text-wrap truncate w-[100px] h-max">
                      {user && user.name}
                    </h2>
                    <p className="text-sm max-[450px]:text-[10px] text-icon text-wrap w-full h-max">
                      {user && user.email}
                    </p>
                  </>
                )}
              </div>

              {modal && (
                <DialogModal
                  onClose={() => setModal(false)}
                  content={<ImageUploader closeHandler={()=>setModal(false)}/>}
                  generateAiStatus={false}
                />
              )}
            </div>

            <div className="links-section w-full flex flex-col items-center gap-4 mt-4 max-[450px]:mt-0">
              {leftLinks.map((item) => {
                return (
                  <LinkButton
                    key={item.id}
                    {...item}
                    setLink={setLink}
                    selectedBtn={selectedLink === item.id ? true : false}
                    sidebarClose={sidebarClose}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT SECTION - PROJECTS */}
        <div
          className={cn(
            "right-section w-[80%] h-full px-4 max-[450px]:px-1",
            sidebarClose ? "w-[90%]" : "max-[450px]:w-[60%]"
          )}
        >
          {renderRightSection()}
        </div>
      </div>

      {/* FOOTER SECTION */}
      <Footer />
    </div>
  );
};

export default Profile;
