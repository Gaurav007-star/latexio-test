/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import EditorPanel from "../../components/Editor/EditorPanel";
import { apiFetch } from "../../api/apiFetch";
import saveAs from "file-saver";
import { useAuth } from "../../context/AuthContext";
import { AvatarCircles } from "@/components/magicui/avatar-circles";
import Logo from "../../assests/editor/logo.png";
import Share from "../../assests/editor/share.svg";
import History from "../../assests/editor/history.svg";
import { TbEdit } from "react-icons/tb";
import UserComponent from "../UserComponent";
import InputDialog from "../Dialog/InputDialog";
import { IoChevronDownSharp } from "react-icons/io5";
import ShareInputComponent from "../ui/ShareUser";
import axios from "axios";
import toast from "react-hot-toast";

const API_BASE_URL = "https://api-iit-kgp-latex.demome.in/api";

function LaTeXEditor() {
  const { id } = useParams();
  const [projectId, setProjectId] = useState(null);
  const [projectUserId, setProjectUserId] = useState(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [editorData, setEditorData] = useState([]);
  const [selectedPageIdx, setSelectedPageIdx] = useState(0);
  const [latexCode, setLatexCode] = useState("");
  const [currentDocId, setCurrentDocId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorLog, setErrorLog] = useState("");
  const [statusMessage, setStatusMessage] = useState("Ready.");
  const [userMenu, setUserMenu] = useState();
  const [showShareModal, setShareModal] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Used to avoid duplicating the initial compile in the latexCode effect
  const ignoreNextLatexEffect = useRef(false);

  useEffect(() => {
    if (!auth.isLoading && !auth.token) {
      navigate("/login", { state: { from: location }, replace: true });
    }
  }, [auth.isLoading, auth.token, navigate, location]);

  const cleanupPdfUrl = useCallback(() => {
    if (pdfUrl) {
      URL.revokeObjectURL(pdfUrl);
      setPdfUrl(null);
    }
  }, [pdfUrl]);

  useEffect(() => {
    const loadProject = async () => {
      setStatusMessage("Loading project...");
      setIsLoading(true);
      try {
        const data = await apiFetch(`/project/${id}`, { method: "GET" });
        if (!data.success || !data.project) {
          setEditorData([]);
          setLatexCode("");
          setCurrentDocId(null);
          setSelectedPageIdx(0);
          setProjectId(null);
          setProjectUserId(null);
          setProjectTitle("");
          setStatusMessage("Project not found or unauthorized.");
          return;
        }
        const project = data.project;
        // console.log(project);

        setProjectId(project._id || null);
        setProjectUserId(project.user_id || null);
        setProjectTitle(project.title || "");
        setEditorData(project.editor || []);
        if (project.editor && project.editor.length > 0) {
          const initialContent = project.editor[0].pg_content || "";
          const initialDocId = project.editor[0]._id || null;
          setLatexCode(initialContent);
          setCurrentDocId(initialDocId);
          setSelectedPageIdx(0);
          setStatusMessage(
            `Loaded project: ${project.title}, page: ${project.editor[0].page_name}`
          );

          // Compile the exact content we just loaded to avoid any stale compile on first load
          // Also tell the latexCode effect to ignore the next change (to prevent duplicate compile).
          ignoreNextLatexEffect.current = true;
          await handleCompile(initialContent);
        } else {
          setLatexCode("");
          setCurrentDocId(null);
          setSelectedPageIdx(0);
          setStatusMessage(`Loaded project: ${project.title}, no pages found.`);
        }
      } catch (error) {
        setStatusMessage("Error loading project. Please try again.");
        setEditorData([]);
        setLatexCode("");
        setCurrentDocId(null);
        setSelectedPageIdx(0);
        setProjectId(null);
        setProjectUserId(null);
        setProjectTitle("");
      } finally {
        setIsLoading(false);
      }
    };
    loadProject();
  }, [id]);

  // Compile handler now supports an optional explicit code parameter to avoid stale state on first load
  const handleCompile = useCallback(
    async (codeOverride) => {
      const codeToCompile =
        typeof codeOverride === "string" ? codeOverride : latexCode;
      setIsLoading(true);
      setErrorLog("");
      setStatusMessage("Compiling...");
      cleanupPdfUrl();
      try {
        const response = await fetch(`${API_BASE_URL}/latex/editor/compile`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latex_code: codeToCompile }),
        });

        if (
          response.ok &&
          response.headers.get("Content-Type")?.includes("application/pdf")
        ) {
          const blob = await response.blob();
          const newPdfUrl = URL.createObjectURL(blob);
          setPdfUrl(newPdfUrl);
          setStatusMessage("Compilation successful.");
        } else {
          let errorData = {};
          try {
            errorData = await response.json();
          } catch {
            errorData.error = `Server error: ${response.status} ${response.statusText}`;
          }
          setStatusMessage(`Compilation failed: ${errorData.error}`);
          setErrorLog(`Error saving page: ${errorData.message}`);
        }
      } catch (error) {
        setStatusMessage(`Error: ${error.message}`);
      } finally {
        setIsLoading(false);
      }
    },
    [latexCode, cleanupPdfUrl]
  );

  // If something else updates latexCode (e.g., EditorPanel compiles and pushes latest content)
  // we can auto-compile, but skip once right after loadProject to avoid duplicating the initial compile.
  useEffect(() => {
    if (!latexCode || !latexCode.trim()) return;
    if (ignoreNextLatexEffect.current) {
      ignoreNextLatexEffect.current = false;
      return;
    }
    // Optional: If you prefer only manual compile, comment this out.
    handleCompile();
    handleSave();
  }, [latexCode]);

  const handleSave = async () => {
    setStatusMessage("Saving...");
    setIsLoading(true);
    setErrorLog("");
    try {
      if (editorData.length === 0) throw new Error("No page to save.");
      const page = editorData[selectedPageIdx];
      const data = await apiFetch("/latex/editor/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: latexCode,
          editorId: page._id,
          projectId: projectId,
        }),
      });

      if (data.success) {
        setCurrentDocId(data.id || page._id);
        setStatusMessage("Page saved successfully!");
        setEditorData((prev) =>
          prev.map((ed, idx) =>
            idx === selectedPageIdx
              ? {
                  ...ed,
                  pg_content: latexCode,
                  lastSaved: new Date().toISOString(),
                }
              : ed
          )
        );
      } else {
        throw new Error(data.error || "Failed to save page.");
      }
    } catch (error) {
      setStatusMessage(`Save failed: ${error.message}`);
      setErrorLog(`Error saving page: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!pdfUrl) {
      setStatusMessage("Compiling for download...");
      await handleCompile();
      setTimeout(() => {
        const currentUrl = pdfUrl;
        if (currentUrl) {
          saveAs(currentUrl, "document.pdf");
          setStatusMessage("PDF download initiated.");
        } else {
          setStatusMessage("Compilation failed, cannot download.");
          alert("Compilation failed. Please check the code and logs.");
        }
      }, 100);
    } else {
      saveAs(pdfUrl, "document.pdf");
      setStatusMessage("PDF download initiated.");
    }
  };

  const handlePageSelect = (idx) => {
    setSelectedPageIdx(idx);
    setLatexCode(editorData[idx].pg_content || "");
    setCurrentDocId(editorData[idx]._id || null);
    setStatusMessage(`Switched to page: ${editorData[idx].page_name}`);
    setErrorLog("");
    cleanupPdfUrl();
  };

  const handleAddPage = async (page) => {
    if (!projectId) {
      alert("Project not loaded. Cannot add page.");
      return;
    }
    const pageName = page || "new_page.tex";
    if (!pageName || pageName.trim() === "") return;
    setStatusMessage("Adding new page...");
    setIsLoading(true);
    try {
      const data = await apiFetch("/latex/editor/addPage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          page_name: pageName.trim(),
          content: "",
        }),
      });
      if (data.success && data.page) {
        setEditorData((prev) => [...prev, data.page]);
        setSelectedPageIdx(editorData.length);
        setLatexCode("");
        setCurrentDocId(data.page._id || null);
        setStatusMessage(`Added new page: ${pageName.trim()}`);
        setErrorLog("");
      } else {
        throw new Error(data.error || "Failed to add page.");
      }
    } catch (error) {
      setStatusMessage(`Add page failed: ${error.message}`);
      setErrorLog(`Error adding page: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPageName = async (idx, title) => {
    if (!projectId) return;
    const oldName = editorData[idx].page_name;
    const newName = title;
    if (!newName || newName.trim() === "" || newName === oldName) return;
    setStatusMessage("Renaming page...");
    setIsLoading(true);
    try {
      const data = await apiFetch("/latex/editor/renamePage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectId,
          pageId: editorData[idx]._id,
          new_page_name: newName.trim(),
        }),
      });
      if (data.success) {
        setEditorData((prev) =>
          prev.map((ed, i) =>
            i === idx ? { ...ed, page_name: newName.trim() } : ed
          )
        );
        setStatusMessage(`Renamed page to: ${newName.trim()}`);
      } else {
        throw new Error(data.error || "Failed to rename page.");
      }
    } catch (error) {
      setStatusMessage(`Rename page failed: ${error.message}`);
      setErrorLog(`Error renaming page: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // UPDATE PROJECT TITLE
  const updateProjctTitle = async (title) => {
    try {
      const data = await apiFetch(`/project/update/title/${projectId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: projectTitle,
        }),
      });
      console.log(data);
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Called by EditorPanel to sync content into parent state
  const handleChange = (value) => {
    const newText = value || "";
    setLatexCode(newText);
  };

  const logoutHandler = () => {
    auth.logout();
    navigate("/login");
  };

  const [inputToggle, setInputToggle] = useState(false);

  const inputRef = useRef(null);

  useEffect(() => {
    if (inputToggle && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputToggle]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      console.log("close");
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setInputToggle(false);
      }
    };
    if (inputToggle) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputToggle]);

  // Add this function to handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setInputToggle(false);
      updateProjctTitle(projectTitle);
    }
  };

  // share-controller
  const [shareUser, setShareUser] = useState(
    JSON.parse(localStorage.getItem("share-user")) || []
  );

  const dummyUser = [
    {
      id: 1,
      name: "user1",
      email: "user1@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 2,
      name: "user2",
      email: "user2@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 3,
      name: "user3",
      email: "user3@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 4,
      name: "user4",
      email: "user4@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 5,
      name: "user5",
      email: "user5@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 6,
      name: "user6",
      email: "user6@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 7,
      name: "user7",
      email: "user7@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 8,
      name: "user8",
      email: "user8@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 9,
      name: "user9",
      email: "user9@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 10,
      name: "user10",
      email: "user10@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 11,
      name: "user11",
      email: "user11@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 12,
      name: "user12",
      email: "user12@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 13,
      name: "user13",
      email: "user13@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 14,
      name: "user14",
      email: "user14@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 15,
      name: "user15",
      email: "user15@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 16,
      name: "user16",
      email: "user16@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 17,
      name: "user17",
      email: "user17@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 18,
      name: "user18",
      email: "user18@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 19,
      name: "user19",
      email: "user19@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
    {
      id: 20,
      name: "user20",
      email: "user20@gmail.com",
      imageUrl: "https://xsgames.co/randomusers/avatar.php?g=pixel",
      invite: false,
    },
  ];

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col w-screen h-screen font-sans bg-gray-100">
      {/* editor-navbar */}
      <nav className="bg-primary w-full h-max flex justify-between items-center text-white p-2 flex-shrink-0 cursor-pointer ">
        {/* left-side */}
        <div className=" left w-[70%] max-[1025px]:w-[50%] h-max flex items-center px-4 ">
          <Link to={"/dashboard"}>
            <img
              src={Logo}
              alt="home/logo"
              className="h-8 max-[1025px]:h-5 w-auto "
            />
          </Link>

          {/* title section */}
          <div className="title-section flex items-center w-[40%] group pl-4 max-[1025px]:pl-2">
            {inputToggle ? (
              <>
                <input
                  ref={inputRef}
                  type="text"
                  name="title"
                  id="title"
                  value={projectTitle}
                  disabled={projectUserId !== auth.user._id}
                  onChange={(e) => setProjectTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className={`text-[24px] max-[450px]:text-[18px] focus:outline-0 pl-5 min-w-[50vw] h-[7vh] overflow-hidden truncate `}
                />
              </>
            ) : (
              <div
                onClick={() =>
                  projectUserId == auth.user._id && setInputToggle(true)
                }
                className="h-[7vh] flex items-center cursor-pointer max-w-full"
              >
                <span
                  className={`text-[24px] max-[450px]:text-[18px] pl-2 truncate overflow-hidden whitespace-nowrap max-w-[50vw]`}
                  title={projectTitle}
                >
                  {projectTitle}
                </span>
                <TbEdit
                  className="w-6 h-6 hidden group-hover:inline-block shrink-0"
                  onClick={() =>
                    projectUserId == auth.user._id && setInputToggle(true)
                  }
                />
              </div>
            )}
          </div>
        </div>

        {/* right-side */}
        <div className=" right w-[30%] max-[1025px]:w-[50%] h-max flex items-center justify-end gap-4 pr-4">
          {shareUser.length > 0 && <AvatarCircles avatarUrls={shareUser} />}

          <div className="link-section w-max h-max flex justify-end items-center gap-4">
            <Link
              onClick={() => setShareModal(true)}
              className="w-max h-max flex items-center gap-1 hover:scale-105 transition-transform duration-200 max-[450px]:hidden"
            >
              <img src={Share} alt="share/icon" className="w-4 h-4" />
              <span>Share</span>
            </Link>

            <Link
              to="#"
              className="w-max h-max flex items-center gap-1 hover:scale-105 transition-transform duration-200 max-[450px]:hidden"
            >
              <img src={History} alt="share/icon" className="w-4 h-4" />
              <span>History</span>
            </Link>

            {showShareModal && (
              <InputDialog
                toggle={showShareModal}
                closeModal={() => setShareModal(false)}
                Component={
                  <ShareInputComponent
                    users={dummyUser}
                    shareUser={shareUser}
                    setShareUser={setShareUser}
                    projectId={projectId}
                  />
                }
              />
            )}
          </div>

          <div
            className="dropdown dropdown-end min-[450px]:hidden relative"
            ref={dropdownRef}
          >
            <button
              className="flex items-center text-white"
              onClick={() => setOpen((prev) => !prev)}
            >
              <IoChevronDownSharp className="w-5 h-5 text-white" />
            </button>

            {open && (
              <ul className="menu dropdown-content grid grid-cols-1 gap-2 text-[16px] bg-primary rounded-box z-10 w-max p-2 shadow-sm">
                <Link
                  onClick={() => {
                    setShareModal(true);
                    setOpen(false);
                  }}
                  className="w-max h-max flex items-center gap-1 hover:scale-105 transition-transform duration-200 px-4 py-2"
                >
                  <img src={Share} alt="share/icon" className="w-4 h-4" />
                  <span>Share</span>
                </Link>
                <Link
                  to="#"
                  onClick={() => setOpen(false)}
                  className="w-max h-max flex items-center gap-1 hover:scale-105 transition-transform duration-200 px-4 py-2"
                >
                  <img src={History} alt="history/icon" className="w-4 h-4" />
                  <span>History</span>
                </Link>
              </ul>
            )}
          </div>

          <UserComponent
            Toggle={userMenu}
            ToggleHandler={() => setUserMenu((prev) => !prev)}
            LogoutHAndler={logoutHandler}
          />
        </div>
      </nav>

      {/* bottom-section */}
      <div className="w-full h-full flex flex-col bg-white shadow-lg overflow-hidden">
        <EditorPanel
          value={latexCode}
          onChange={handleChange}
          statusMessage={statusMessage}
          errorLog={errorLog}
          isLoading={isLoading}
          onCompile={handleCompile}
          onDownload={handleDownload}
          onSave={handleSave}
          isPdfAvailable={!!pdfUrl}
          key={currentDocId || Math.random().toString(36).substring(7)}
          currentDocId={currentDocId}
          pdfUrl={pdfUrl}
          handleAddPage={handleAddPage}
          editorData={editorData}
          selectedPageIdx={selectedPageIdx}
          handlePageSelect={handlePageSelect}
          handleEditPageName={handleEditPageName}
        />
      </div>
    </div>
  );
}

export default LaTeXEditor;
