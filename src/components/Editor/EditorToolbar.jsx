import React, { useCallback, useEffect, useRef, useState } from "react";
import { redo, undo } from "@codemirror/commands";
import LeftArrow from "../../assests/editor/leftarrow.svg";
import RightArrow from "../../assests/editor/rightarrow.svg";
import { Button } from "@/components/ui/button";
import uploadIcon from "../../assests/editor/uploadIcon.png";
// drop-down-section
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { LuSendHorizontal } from "react-icons/lu";
import { IoSaveOutline } from "react-icons/io5";
import { VscCloudDownload } from "react-icons/vsc";
import { FaWandMagicSparkles } from "react-icons/fa6";
import { FaTools } from "react-icons/fa"; // Correct import for FaTools
import { FiAlignLeft } from "react-icons/fi";
import { FiAlignRight } from "react-icons/fi";
import { FiAlignCenter } from "react-icons/fi";
import { IoChevronDownSharp } from "react-icons/io5";
import {
  MagnifyingGlassIcon,
  ArrowDownIcon,
  EllipsisHorizontalIcon
} from "@heroicons/react/24/outline";
import Logs from "../Logs";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";
import axios from "axios";
import DialogModal from "../Dialog/DialogAIGen"; // Make sure this is your DialogModal component
import { useAuth } from "@/context/AuthContext";
import { Spinner } from "../ui/kibo-ui/spinner";

// --- AI Proxy URL ---
const PROXY_URL = "https://api-iit-kgp-latex.demome.in/api/open-ai/openai-chat";

const SHORTCUTS = {
  bold: "Ctrl+B",
  italic: "Ctrl+I",
  underline: "Ctrl+U",
  math: "Ctrl+M",
  displayMath: "Ctrl+Shift+M",
  itemize: "",
  enumerate: "",
  table: "",
  image: "",
  link: "",
  label: "",
  ref: "Ctrl+R",
  cite: "Ctrl+Shift+R",
  comment: "Ctrl+/",
  "left-align": "",
  "center-align": "",
  "right-align": "",
  compile: "Ctrl+Shift+C",
  save: "Ctrl+S",
  download: "Ctrl+Shift+D",
  undo: "Ctrl+Z",
  redo: "Ctrl+Y"
};

const icons = {
  bold: "fas fa-bold",
  italic: "fas fa-italic",
  underline: "fas fa-underline",
  section: "fas fa-heading",
  math: "fas fa-square-root-variable",
  displayMath: "fas fa-calculator",
  itemize: "fas fa-list-ul",
  enumerate: "fas fa-list-ol",
  table: "fas fa-table",
  image: "fas fa-image",
  link: "fas fa-link",
  label: "fas fa-tag",
  ref: "fas fa-bookmark",
  cite: "fas fa-book",
  comment: "fas fa-comment-slash",
  undo: "fas fa-undo",
  redo: "fas fa-redo"
};

// Create a toolbar button (only one of iconClass or imgSrc should be provided)
const createButton = (
  id,
  title,
  action,
  iconClass = null,
  reactIcons = false,
  imgSrc = null,
  requiresPkg = null
) => ({
  id,
  title,
  iconClass,
  reactIcons,
  imgSrc,
  action,
  requiresPkg
});

const EditorToolbar = ({
  value,
  onChange,
  onExecuteCommand,
  onInsertOrWrap,
  onInsertBlock,
  onToggleComment,
  getEditorContent,
  setEditorContent, // For AI correction
  insertAtCursor, // For AI code insertion
  compileHandler,
  saveHandler,
  pdfDownloadHandler,
  isLoading,
  statusMessage,
  errorLog,
  shortcuts = SHORTCUTS
}) => {
  // Image handling
  const [file, setFile] = useState("");
  const [modal, setModal] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const { user } = useAuth();
  
  const handleDrop = (file) => {
    setFile(file);
  };

  const ImageUploadHandler = async () => {
    if (!file) return toast.error("Please upload image");
    setImageLoading(true);
    const form = new FormData();
    form.append("file", file);
    form.append("upload_preset", import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
    form.append("cloud_name", import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${
          import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
        }/image/upload`,
        form
      );
      const image_url = response.data?.secure_url;
      handleInsertOrWrap(
        `\\includegraphics[width=0.8\\textwidth]{${image_url}`,
        "}",
        false,
        "graphicx"
      );
      setFile("");
      setModal(false);
      setImageLoading(false);
    } catch (error) {
      toast.error("failed to upload image");
      setImageLoading(false);
    }
  };

  const checkPackage = (pkg) => {
    if (!pkg) return true;
    const doc = getEditorContent ? getEditorContent() : "";
    if (doc && !doc.includes(`\\usepackage{${pkg}}`)) {
      alert(
        `Warning: This feature typically requires the '${pkg}' package. Please ensure '\\usepackage{${pkg}}' is included in your document preamble.`
      );
    }
    return true;
  };

  const handleInsertOrWrap = (
    startTag,
    endTag = "",
    block = false,
    requiresPkg = null
  ) => {
    if (checkPackage(requiresPkg)) {
      onInsertOrWrap(startTag, endTag, block);
    }
  };

  const handleInsertBlock = (text, lineOffset, charOffset) => {
    onInsertBlock(text, lineOffset, charOffset);
  };

  const handleToggleComment = () => {
    onToggleComment();
  };

  const handleExecuteCommand = (command) => {
    onExecuteCommand(command);
  };

  const [position, setPosition] = useState("bottom");

  const buttons = [
    createButton(
      "bold",
      "Bold",
      () => handleInsertOrWrap("\\textbf{", "}"),
      icons.bold
    ),
    createButton(
      "italic",
      "Italic",
      () => handleInsertOrWrap("\\textit{", "}"),
      icons.italic
    ),
    createButton(
      "underline",
      "Underline",
      () => handleInsertOrWrap("\\underline{", "}", false, "ulem"),
      icons.underline
    ),
    { type: "separator" },
    createButton(
      "math",
      "Inline Math",
      () => handleInsertOrWrap("$", "$"),
      icons.math
    ),
    createButton(
      "displayMath",
      "Display Math",
      () => handleInsertOrWrap("\\[\n", "\n\\]", true),
      icons.displayMath
    ),
    { type: "separator" },
    createButton(
      "itemize",
      "Bullet List",
      () =>
        handleInsertBlock(
          "\\begin{itemize}\n    \\item \n\\end{itemize}\n",
          1,
          10
        ),
      icons.itemize
    ),
    createButton(
      "enumerate",
      "Numbered List",
      () =>
        handleInsertBlock(
          "\\begin{enumerate}\n    \\item \n\\end{enumerate}\n",
          1,
          10
        ),
      icons.enumerate
    ),
    createButton(
      "table",
      "Insert Table",
      () =>
        handleInsertBlock(
          "\\begin{table}[htbp]\n    \\centering\n    \\caption{}\n    \\label{tab:}\n    \\begin{tabular}{|c|c|}\n        \\hline\n         & \\\\\n        \\hline\n         & \\\\\n        \\hline\n    \\end{tabular}\n\\end{table}\n",
          2,
          14
        ),
      icons.table
    ),
    { type: "separator" },
    // Image
    createButton(
      "image",
      "Insert Image",
      () =>
        handleInsertOrWrap(
          "\\includegraphics[width=0.8\\textwidth]{",
          "}",
          false,
          "graphicx"
        ),
      icons.image
    ),
    createButton(
      "link",
      "Insert Link",
      () => handleInsertOrWrap("\\url{", "}", false, "hyperref"),
      icons.link
    ),
    createButton(
      "label",
      "Insert Label",
      () => handleInsertOrWrap("\\label{", "}"),
      icons.label
    ),
    createButton(
      "ref",
      "Insert Reference",
      () => handleInsertOrWrap("\\ref{", "}"),
      icons.ref
    ),
    createButton(
      "cite",
      "Insert Citation",
      () => handleInsertOrWrap("\\cite{", "}"),
      icons.cite
    ),
    createButton(
      "comment",
      "Comment Line(s)",
      handleToggleComment,
      icons.comment
    ),
    { type: "separator" },
    createButton(
      "left-align",
      "left-align",
      () =>
        handleInsertBlock(
          "\\begin{flushleft}\n    \\item \n\\end{flushleft}\n",
          1,
          10
        ),
      FiAlignLeft,
      true,
      null
    ),
    createButton(
      "center-align",
      "center-align",
      () =>
        handleInsertBlock(
          "\\begin{center}\n    \\item \n\\end{center}\n",
          1,
          10
        ),
      FiAlignCenter,
      true,
      null
    ),
    createButton(
      "right-align",
      "right-align",
      () =>
        handleInsertBlock(
          "\\begin{flushright}\n    \\item \n\\end{flushright}\n",
          1,
          10
        ),
      FiAlignRight,
      true,
      null
    ),
    { type: "separator" },
    createButton(
      "ai-generate",
      "Generate LaTeX Code with AI",
      () => setShowGenModal(true),
      FaWandMagicSparkles,
      true,
      null
    ),
    createButton(
      "ai-correct",
      "Correct with AI",
      () => {
        setShowCorrModal(true);
        handleCorrectLatex();
      },
      FaTools,
      true,
      null
    ),
    { type: "separator" }
  ];

  // Helper to build tooltip with shortcut
  const getTooltip = (id, title) =>
    shortcuts[id] && shortcuts[id].length > 0
      ? `${title} (${shortcuts[id]})`
      : title;

  // --- AI Integration State and Logic ---
  const [showGenModal, setShowGenModal] = useState(false);
  const [genInput, setGenInput] = useState("");
  const [genLoading, setGenLoading] = useState(false);

  const [showCorrModal, setShowCorrModal] = useState(false);
  const [corrLoading, setCorrLoading] = useState(false);
  const [corrResult, setCorrResult] = useState(null);

  // Generate LaTeX from natural language
  const handleGenerateLatex = async () => {
    if (!genInput.trim()) return;
    setGenLoading(true);
    setCorrResult(null);
    try {
      const prompt = `
You are a LaTeX expert. Your task is to take the following instruction and generate only the corresponding LaTeX code. 
Do not include explanations, comments, or any surrounding text — return strictly the LaTeX code snippet. 
If the instruction modifies or extends the existing LaTeX code, update it accordingly while keeping it valid and compilable.

Instruction: "${genInput.trim()}"

Current LaTeX code:
${value}
`;

      // console.log("Ai value", prompt);

      const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 400
        })
      });
      const data = await response.json();
      const code = data.choices?.[0]?.message?.content?.trim() ?? "";
      if (code && insertAtCursor) {
        // insertAtCursor(code); // Insert into editor at cursor
        // set the code into editor and save and compile
        setEditorContent(code);
        onChange(code);
        setShowGenModal(false);
        setGenInput("");
      }
    } catch (err) {
      alert("AI Error: " + err.message);
    }
    setGenLoading(false);
  };

  // Correct LaTeX code
  const handleCorrectLatex = async () => {
    setCorrLoading(true);
    setCorrResult(null);
    try {
      const code = getEditorContent();
      const prompt = `
You are a LaTeX expert. The following LaTeX code may have errors.
Correct any mistakes and return the entire corrected code as plain text, suitable to be pasted to replace the original.
After the corrected code, provide an explanation of the changes you made.
Format:
CORRECTED_CODE_START
<the complete corrected LaTeX code here>
CORRECTED_CODE_END
EXPLANATION_START
<your explanation of changes here>
EXPLANATION_END
----------
${code}
    `;
      const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1200
        })
      });
      const data = await response.json();
      const aiText = data.choices?.[0]?.message?.content ?? "";

      // Extract code and explanation blocks
      const codeMatch = aiText.match(
        /CORRECTED_CODE_START\s*([\s\S]*?)\s*CORRECTED_CODE_END/
      );
      const explanationMatch = aiText.match(
        /EXPLANATION_START\s*([\s\S]*?)\s*EXPLANATION_END/
      );

      setCorrResult({
        correction: codeMatch ? codeMatch[1].trim() : aiText.trim(),
        explanation: explanationMatch ? explanationMatch[1].trim() : ""
      });
    } catch (err) {
      setCorrResult({
        correction: "",
        explanation: "AI Error: " + err.message
      });
    }
    setCorrLoading(false);
  };

  const handleAcceptCorrection = () => {
    if (corrResult?.correction && setEditorContent) {
      setEditorContent(corrResult.correction);
      setShowCorrModal(false);
      setCorrResult(null);
    }
  };

  // SET TO COMPILE FIRST TIME WHEN PAGE RELOAD
  const [firstTimePdfGenerate, setFirstTimeGenerate] = useState(false);

  useEffect(() => {
    const runFirstCompile = async () => {
      await compileHandler(); // wait for compile to finish
      setFirstTimeGenerate(true); // now show logs
    };

    runFirstCompile();
  }, []);

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-shadow w-full h-[7vh] py-3 flex items-center justify-between max-[1025px]:justify-center flex-shrink-0 text-[14px] font-semibold">
      {/* LARGE SCREEN */}
      <div className="middle-icons flex items-center w-[75%] h-max max-[1025px]:hidden">
        {buttons.map((item, index) => {
          if ("type" in item && item.type === "separator") {
            return (
              <span
                key={`sep-${index}`}
                className="border-l border-white mx-1 self-stretch"
              />
            );
          }

          return (
            <button
              key={item.id}
              id={`btn-${item.id}`}
              title={getTooltip(item.id, item.title)}
              onClick={item.id === "image" ? () => setModal(true) : item.action}
              className="w-max h-max px-2 py-1 flex items-center rounded text-icon  hover:bg-light-shadow hover:text-white text-sm transition-colors duration-150 cursor-pointer"
            >
              {item.iconClass && item.reactIcons ? (
                <item.iconClass className={`w-4 h-4  `} />
              ) : (
                <i className={`${item.iconClass} w-4 h-4 `} />
              )}
              {!item.iconClass && item.imgSrc && (
                <img
                  src={item.imgSrc}
                  alt={item.title}
                  className="h-fit w-[50px] object-cover"
                />
              )}
            </button>
          );
        })}

        {/* search-input-section */}
        <button className="input-search-section cursor-pointer flex items-center justify-center w-max h-max relative px-2 py-1 border-r-[1px]">
          <MagnifyingGlassIcon className="w-5 h-5 text-icon" />
        </button>

        {/* Text-select-dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="flex items-center gap-1 w-max cursor-pointer text-icon px-2">
              Paragraph
              <ArrowDownIcon className="w-4 h-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-max bg-white border-0 text-black shadow-md">
            <DropdownMenuLabel value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\paragraph{", "}")}
              >
                Paragraph
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\section{", "}")}
              >
                Section
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\subsection{", "}")}
              >
                Sub-section
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\subsubsection{", "}")}
              >
                Subsub-section
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\subparagraph{", "}")}
              >
                Sub-paragraph
              </DropdownMenuRadioItem>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* ...[MOBILE/TABLET toolbar code]... */}
      <div className="middle-icons flex items-center w-[50%] h-max min-[1025px]:hidden">
        {/* Tool section */}
        <div className="relative " ref={dropdownRef}>
          {/* Trigger button */}
          <button
            className="input-search-section cursor-pointer flex items-center justify-center px-2 py-1 border-r-[1px]"
            onClick={() => setOpen((prev) => !prev)}
          >
            <IoChevronDownSharp className="w-5 h-5 text-icon" />
            <span className="ml-1">Tools</span>
          </button>

          {/* Dropdown menu */}
          {open && (
            <ul className="absolute top-full left-4 menu grid grid-cols-4 gap-2 bg-primary rounded-box z-10 w-max p-2 shadow-sm">
              {buttons.map((item) => {
                if ("type" in item && item.type === "separator") return null;

                return (
                  <button
                    key={item.id}
                    id={`btn-${item.id}`}
                    title={getTooltip(item.id, item.title)}
                    onClick={() => {
                      if (item.id === "image") {
                        setModal(true);
                      } else {
                        item.action?.();
                      }
                      setOpen(false); // close after click
                    }}
                    className="flex items-center justify-center w-10 h-10 bg-[#b7a1b7] rounded hover:scale-105 text-sm transition duration-150 cursor-pointer"
                  >
                    {item.iconClass && item.reactIcons ? (
                      <item.iconClass className="w-5 h-5 text-white" />
                    ) : (
                      <i className={`${item.iconClass} w-5 h-5 text-white`} />
                    )}
                    {!item.iconClass && item.imgSrc && (
                      <img
                        src={item.imgSrc}
                        alt={item.title}
                        className="h-6 w-6 object-contain"
                      />
                    )}
                  </button>
                );
              })}
            </ul>
          )}
        </div>

        {/* search-section */}
        {/* <button className="input-search-section cursor-pointer flex items-center justify-center w-max h-max relative px-2 py-1 border-r-[1px]">
          <MagnifyingGlassIcon className="w-5 h-5 text-white" />
        </button> */}

        {/* paragraph -section */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <span className="flex items-center gap-1 w-max cursor-pointer text-icon px-2">
              Paragraph
              <ArrowDownIcon className="w-4 h-4" />
            </span>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-max bg-white border-0 text-black shadow-md">
            <DropdownMenuLabel value={position} onValueChange={setPosition}>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\paragraph{", "}")}
              >
                Paragraph
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\section{", "}")}
              >
                Section
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\subsection{", "}")}
              >
                Sub-section
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\subsubsection{", "}")}
              >
                Subsub-section
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem
                value="top"
                onClick={() => handleInsertOrWrap("\\subparagraph{", "}")}
              >
                Sub-paragraph
              </DropdownMenuRadioItem>
            </DropdownMenuLabel>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* comment:IMAGE-Modal-section */}
      <input
        type="checkbox"
        id="my_modal_7"
        className="modal-toggle"
        checked={modal}
      />
      <div className="modal" role="dialog">
        <div className="modal-box w-[400px] rounded-4xl">
          <div className="image-wrapper w-full h-max flex items-center justify-center">
            <label
              htmlFor="file"
              className="w-full h-[300px] overflow-hidden rounded-4xl flex items-center justify-center border-2 border-dashed border-primary cursor-pointer "
            >
              {file ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Uploaded"
                  className="w-fit h-full object-cover object-center rounded-4xl"
                />
              ) : (
                <div className="text-primary flex flex-col items-center">
                  <img
                    src={uploadIcon}
                    alt="upload/icon"
                    className="w-[70px] h-[70px] bg-cover"
                  />
                  Click to upload image
                </div>
              )}
            </label>
            <input
              type="file"
              id="file"
              accept="image/*"
              onChange={(e) => handleDrop(e.target.files[0])}
              className="file-input file-input-bordered file-input-sm w-full max-w-xs hidden"
              required
            />
          </div>
          <div className="button-section w-full h-max flex items-center justify-center gap-2 mt-5">
            <button
              onClick={ImageUploadHandler}
              className="bg-primary text-white rounded-full w-[50%] h-[40px] hover:scale-105 transition-transform duration-200 cursor-pointer"
              disabled={imageLoading}
            >
              {imageLoading ? (
                <span className="loading loading-dots loading-lg"></span>
              ) : (
                "Upload"
              )}
            </button>
            <button
              onClick={() => setModal(false)}
              className="text-black rounded-full w-[50%] h-[40px] border-2 border-secondary hover:scale-105 transition-transform duration-200 cursor-pointer"
              disabled={imageLoading}
            >
              Close
            </button>
          </div>
        </div>
        <label
          className="modal-backdrop w-screen h-screen"
          htmlFor="my_modal_7"
          onClick={() => setModal(false)}
        >
          Close
        </label>
      </div>

      {/* right-section */}
      <div className="right-section w-[25%] max-[1025px]:w-[50%] h-max flex items-center justify-end max-[1025px]:pr-2">
        {/* Log section */}
        {firstTimePdfGenerate && (
          <Logs
            isLoading={isLoading}
            statusMessage={statusMessage}
            errorLog={errorLog}
          />
        )}

        {/* compile-save-download section */}
        <div className="button-save-download w-max text-icon max-[1025px]:w-full h-max flex flex-row-reverse items-center px-2 gap-2 max-[1025px]:hidden">
          <Button
            onClick={compileHandler}
            disabled={isLoading}
            className={`px-3 py-2 text-sm font-semibold flex items-center ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-primary rounded-full hover:scale-105 transition-transform cursor-pointer duration-200"
            }`}
            title={getTooltip("compile", "Compile")}
          >
            <i
              className={`fas ${
                isLoading ? "fa-spinner fa-spin" : "fa-sync-alt"
              }`}
            />
            {isLoading ? "Compiling..." : "Compile"}
          </Button>
        </div>

        {/* undo-redo section */}
        <div className="undo-redo-section w-max max-[1025px]:w-[50%] h-max px-5 flex items-center gap-2 max-[1025px]:hidden">
          <img
            src={LeftArrow}
            className={`${icons.undo} text-white cursor-pointer hover:scale-105 transition-transform duration-200`}
            onClick={() => handleExecuteCommand(undo)}
            title={getTooltip("undo", "Undo")}
          />
          <img
            src={RightArrow}
            className={`${icons.redo} text-white cursor-pointer hover:scale-105 transition-transform duration-200`}
            onClick={() => handleExecuteCommand(redo)}
            title={getTooltip("redo", "Redo")}
          />
        </div>

        {/* Compile-dropdown-section */}
        <details className="dropdown dropdown-end min-[1025px]:hidden">
          <summary className="flex items-center text-white">
            <div className="drop-down-button w-max flex items-center justify-center gap-1 px-2 rounded-md bg-primary">
              <IoChevronDownSharp className="w-4 h-4 text-white" />
              <button
                onClick={compileHandler}
                disabled={isLoading}
                className={` py-2 text-[12px] font-semibold flex items-center gap-2 ${
                  isLoading ? "text-gray-400 cursor-not-allowed" : ""
                }`}
                title={getTooltip("compile", "Compile")}
              >
                <i
                  className={`fas text-[10px] ${
                    isLoading ? "fa-spinner fa-spin" : "fa-sync-alt"
                  }`}
                />
                {isLoading ? "Compiling..." : "Compile"}
              </button>
            </div>
          </summary>
          <ul className="dropdown-content gap-1 z-0 bg-white mt-2 rounded-box w-[200px] p-2 shadow-sm">
            <div
              className="download flex items-center gap-1 w-full h-max p-2 text-[20px] "
              onClick={saveHandler}
              disabled={isLoading}
            >
              <IoSaveOutline
                className={`w-[30px] h-[30px] font-semibold text-primary  flex items-center `}
                title={getTooltip("save", "Save")}
              />
              <span>Save</span>
            </div>
            <div
              className="download flex items-center gap-1 w-full h-max p-2 text-[20px]"
              onClick={pdfDownloadHandler}
              disabled={isLoading}
            >
              <VscCloudDownload
                className={`w-[30px] h-[30px] font-semibold text-primary flex items-center`}
                title={getTooltip("download", "Download PDF")}
              />
              <span>Download</span>
            </div>
          </ul>
        </details>
      </div>

      {/* --- AI Generate Modal --- */}
      {showGenModal && (
        <DialogModal
          title={`Hi, ${user && user?.name}`}
          isLoading={genLoading}
          inputValue={genInput}
          setInputValue={setGenInput}
          submitHandler={handleGenerateLatex}
          onClose={() => setShowGenModal(false)}
          buttonText="Generate"
          label={`Describe what you want in LaTeX (e.g. 'Create a table of 2x3')`}
          BtnIcon={LuSendHorizontal}
          generateAiStatus={true}
        />
      )}

      {/* --- AI Correction Modal --- */}
      {showCorrModal && (
        <DialogModal
          title="AI Correction Result"
          isLoading={corrLoading}
          inputValue={""}
          setInputValue={() => {}}
          submitHandler={handleAcceptCorrection}
          onClose={() => setShowCorrModal(false)}
          buttonText="Replace in Editor"
          label=""
          disabled={!corrResult?.correction}
          generateAiStatus={false}
          content={
            <div className="error-correction max-h-[600px]">
              {corrResult ? (
                <>
                  {" "}
                  <div>
                    <h1 className="text-[15px]">Explanation:</h1>
                    <p className="whitespace-pre-line text-secondary overflow-y-scroll">
                      {corrResult?.explanation}
                    </p>
                  </div>
                  <div className="mt-3">
                    <h1 className="text-[15px]">Corrected Code:</h1>
                    <pre className="bg-shade my-2 rounded p-2 max-h-64 w-full text-wrap overflow-x-hidden text-icon font-normal">
                      {corrResult?.correction}
                    </pre>
                  </div>
                  <div className="button-section mt-3 w-full h-max flex justify-end">
                    <button
                      onClick={handleAcceptCorrection}
                      className="px-4 py-2 bg-primary text-white hover:scale-105 transition-transform duration-200 cursor-pointer rounded-full"
                    >
                      Replace
                    </button>
                  </div>
                </>
              ) : (
                <div className="loader-section w-full flex items-center justify-center gap-2 text-[20px] text-primary font-semibold">
                  <h2>Ai is thinking...</h2>
                  <Spinner className={`text-primary`} size={40} />
                </div>
              )}
            </div>
          }
        />
      )}
    </div>
  );
};

export default EditorToolbar;
