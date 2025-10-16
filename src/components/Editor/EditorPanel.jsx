/* EditorPanel.jsx */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useRef, useCallback, useState, useEffect } from "react";
import Editor, { useMonaco } from "@monaco-editor/react";
import EditorToolbar from "./EditorToolbar";
import * as Y from "yjs";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { useAuth } from "../../context/AuthContext";
import PreviewPanel from "./PreviewPanel";
import {
  EllipsisVerticalIcon,
  ChevronDownIcon,
  PlusIcon,
  ArrowUpOnSquareStackIcon,
  FolderOpenIcon
} from "@heroicons/react/24/solid";
import { HiOutlineMenuAlt1 as Menu } from "react-icons/hi";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from "@/components/ui/resizable";

import {
  TreeExpander,
  TreeIcon,
  TreeLabel,
  TreeNode,
  TreeNodeContent,
  TreeNodeTrigger,
  TreeProvider,
  TreeView
} from "@/components/ui/kibo-ui/tree";

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/components/ui/popover";
import DialogModal from "../Dialog/DialogModal";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoIosArrowUp } from "react-icons/io";

// Map of toolbar button id -> keyboard shortcut
const SHORTCUTS = {
  bold: "Ctrl+B",
  italic: "Ctrl+I",
  underline: "Ctrl+U",
  math: "Ctrl+M",
  displayMath: "Ctrl+Shift+M",
  itemize: "",
  enumerate: "",
  table: "",
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

const options = [
  { link: "#", tag: "Rename" },
  { link: "#", tag: "Download" },
  { link: "#", tag: "Delete" },
  { link: "#", tag: "New File" },
  { link: "#", tag: "New Folder" },
  { link: "#", tag: "Folder" }
];

// GET THE WINDOW SIZE FOR MOBILE PDF SCREEN
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 450);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isMobile;
}

const EditorPanel = ({
  value, // initial LaTeX code from backend (string)
  statusMessage,
  errorLog,
  isLoading,
  onCompile,
  onChange,
  onDownload,
  onSave,
  isPdfAvailable,
  currentDocId,
  pdfUrl,
  handleAddPage,
  editorData = [],
  selectedPageIdx,
  handlePageSelect,
  handleEditPageName
}) => {
  const editorRef = useRef(null);
  const monaco = useMonaco();
  const ydocRef = useRef(new Y.Doc());
  const providerRef = useRef(null);
  const bindingRef = useRef(null);
  const firstLoadRef = useRef(true);

  // Track the current Y.Text to observe live changes for outline updates
  const yTextRef = useRef(null);

  // Debounce timer for outline recomputation
  const outlineTimerRef = useRef(null);

  const [userName, setUserName] = useState("Anonymous");

  // Generate consistent color based on user ID or random
  const userColor = useRef(
    `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`
  ).current;

  const { user } = useAuth();
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [pageName, setPageName] = useState("");
  const [fileOutLine, setFileOutLine] = useState(false);

  // Each section: { title, index, relPos }
  const [sectionTitles, setSectionTitles] = useState([]);

  const [editorReady, setEditorReady] = useState(false);
  const [forceUpdate, setForceUpdate] = useState(0);

  // GET THE SCREEN SIZE FOR CLOSE AND OPEN THE PDF VIEWER IN MOBILE SCREEN
  const isMobile = useIsMobile();

  // FIRST RELOAD THE PDF VIEWER IS NOT SHOW
  useEffect(() => {
    if (pdfUrl && isMobile) {
      if (firstLoadRef.current) {
        // first render, keep side-by-side
        firstLoadRef.current = false;
      } else {
        // after reload or subsequent compiles → show PDF full width
        collapsePanel();
      }
    }
  }, [pdfUrl]);

  // Force rerender function
  const forceRerender = useCallback(() => {
    setForceUpdate((prev) => prev + 1);
  }, []);

  // awareness: set local user info when available
  useEffect(() => {
    if (user && providerRef.current) {
      setUserName(user.name);
      try {
        providerRef.current.awareness.setLocalStateField("user", {
          name: user.name,
          color: userColor,
          cursor: null
        });
      } catch (e) {
        // ignore if provider not ready yet
      }
    }
  }, [user, userColor]);

  // MONACO CUSTOM THEME
  const defineNoctisLilacTheme = (monaco) => {
    monaco.editor.defineTheme("noctisLilacMonaco", {
      base: "vs-dark",
      inherit: false,
      rules: [
        { token: "keyword", foreground: "#4a154b" },
        { token: "comment", foreground: "#5c6773", fontStyle: "italic" },
        { token: "string", foreground: "#f3e88d" },
        { token: "number", foreground: "#ffb86c" },
        { token: "function", foreground: "#8be9fd" },
        { token: "bracket", foreground: "#0095a8" },
        { token: "delimiter.curly", fontStyle: "bold", foreground: "#0095a8" },
        { token: "delimiter.square", foreground: "#008000" },
        { token: "delimiter.paren", foreground: "#b000b0" }
      ],
      colors: {
        "editor.background": "#f2f1f8",
        "editor.foreground": "#ff7a5a",
        "editor.selectionBackground": "#d7d3f3",
        "editorCursor.foreground": "#4a154b",
        "editor.lineHighlightBackground": "#e2dff6",
        "editorBracketHighlight.foreground1": "#0095a8",
        "editorBracketHighlight.foreground2": "#008000",
        "editorBracketHighlight.foreground3": "#b000b0",
        "editorBracketMatch.border": "#0095a8"
      }
    });
  };

  // Setup LaTeX syntax highlighting in Monaco
  useEffect(() => {
    if (monaco) {
      monaco.languages.register({ id: "latex" });

      // KEYWORD-COMMENTS-BRACKETS ETC
      monaco.languages.setMonarchTokensProvider("latex", {
        tokenizer: {
          root: [
            [/\\[a-zA-Z]+/, "keyword"],
            [/%.*$/, "comment"],
            [/\$[^$]+\$/, "string"],
            [/[{}]/, "delimiter.curly"],
            [/\[|\]/, "delimiter.square"],
            [/\(|\)/, "delimiter.paren"]
          ]
        }
      });

      monaco.languages.setLanguageConfiguration("latex", {
        comments: { lineComment: "%" },
        brackets: [
          ["{", "}"],
          ["[", "]"],
          ["(", ")"]
        ]
      });
    }
  }, [monaco]);

  // Build section list from text, attaching Yjs RelativePosition for robust navigation
  const updateSectionTitlesFromText = useCallback((text, yTextForRelPos) => {
    if (!text) {
      setSectionTitles([]);
      return;
    }
    // Matches \section{}, \subsection{}, \sectionheader{}, etc.
    const sectionRegex = /\\[a-zA-Z@]*section[a-zA-Z@]*\s*\{([^}]*)\}/g;
    const matches = [];
    let match;
    while ((match = sectionRegex.exec(text)) !== null) {
      const absIndex = match.index;
      let relPos = null;
      try {
        if (yTextForRelPos) {
          relPos = Y.createRelativePositionFromTypeIndex(
            yTextForRelPos,
            absIndex
          );
        }
      } catch {}
      matches.push({
        title: match[1],
        index: absIndex,
        relPos
      });
    }
    setSectionTitles(matches);
  }, []);

  // If only value is present (before Yjs is ready), compute once
  useEffect(() => {
    if (value !== undefined) {
      updateSectionTitlesFromText(value, yTextRef.current || null);
    }
  }, [value, updateSectionTitlesFromText]);

  // Debounced scheduling for outline update from current source of truth
  const scheduleOutlineUpdate = useCallback(() => {
    if (outlineTimerRef.current) clearTimeout(outlineTimerRef.current);
    outlineTimerRef.current = setTimeout(() => {
      try {
        const yText = yTextRef.current;
        if (yText) {
          updateSectionTitlesFromText(yText.toString(), yText);
        } else if (editorRef.current) {
          updateSectionTitlesFromText(editorRef.current.getValue() || "", null);
        } else {
          updateSectionTitlesFromText(value || "", null);
        }
      } catch {
        // ignore
      }
    }, 120);
  }, [updateSectionTitlesFromText, value]);

  // Prefer Yjs content if available; otherwise fall back to Monaco or prop value
  const getEditorContent = useCallback(() => {
    try {
      const ydoc = docs.current.get(currentDocId) || ydocRef.current;
      const yText = ydoc?.getText("monaco");
      if (yText && yText.length > 0) return yText.toString();
    } catch (e) {
      // ignore and fallback
      console.warn("getEditorContent: Yjs read failed:", e);
    }

    if (editorRef.current) {
      try {
        return editorRef.current.getValue() || "";
      } catch (e) {
        console.warn("getEditorContent: editor.getValue() failed", e);
      }
    }

    return value || "";
  }, [currentDocId, value]);

  // COMPILE HANDLER — compile the exact latest content, and also sync it upward
  const handleCompile = useCallback(async () => {
    const latestValue = getEditorContent();
    if (!latestValue || !latestValue.trim()) {
      console.warn("No code provided. Aborting compile.");
      return;
    }
    onChange(latestValue);
    // onCompile?.(latestValue);
  }, [getEditorContent, onChange]);

  // SET EDITOR CONTENT
  const setEditorContent = useCallback(
    (newContent) => {
      try {
        const ydoc = docs.current.get(currentDocId) || ydocRef.current;
        const yText = ydoc?.getText("monaco");
        if (!yText) return;
        yText.delete(0, yText.length);
        if (newContent) yText.insert(0, newContent);
      } catch (e) {
        console.warn("setEditorContent failed:", e);
      }
    },
    [currentDocId]
  );

  // insert text at cursor (uses Monaco API; that will propagate via binding)
  const insertAtCursor = (text) => {
    const editor = editorRef.current;
    if (!editor || !monaco) return;
    const selection = editor.getSelection();
    const range = new monaco.Range(
      selection.startLineNumber,
      selection.startColumn,
      selection.endLineNumber,
      selection.endColumn
    );
    editor.executeEdits("", [{ range, text, forceMoveMarkers: true }]);
    editor.focus();
  };

  const handleToggleComment = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.trigger("keyboard", "editor.action.commentLine", {});
  }, []);

  // Use Yjs relative position (if available) to navigate to a section's current index
  const handleSectionTitleClick = (section) => {
    if (!editorRef.current) return;
    const model = editorRef.current.getModel();

    let index = section.index;
    try {
      const ydoc = docs.current.get(currentDocId) || ydocRef.current;
      if (section.relPos && ydoc) {
        const abs = Y.createAbsolutePositionFromRelativePosition(
          section.relPos,
          ydoc
        );
        if (abs && typeof abs.index === "number") {
          index = abs.index;
        }
      }
    } catch (e) {
      // fallback to stored index
    }

    const position = model.getPositionAt(index);
    editorRef.current.setPosition(position);
    editorRef.current.revealPositionInCenter(position);
    editorRef.current.focus();
  };

  // FOR MOBILE SIDEBAR TOGGLER
  const SideBarHandler = () => {
    setSidebarToggle((prev) => !prev);
  };

  // Keyboard Shortcut
  useEffect(() => {
    function handleKeyDown(e) {
      const active = document.activeElement;
      const isInput =
        active &&
        (["INPUT", "TEXTAREA"].includes(active.tagName) ||
          active.className?.includes("monaco-editor"));
      if (!isInput) return;

      if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "s"
      ) {
        e.preventDefault();
        onSave?.();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "d"
      ) {
        e.preventDefault();
        onDownload?.();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "c"
      ) {
        e.preventDefault();
        handleCompile();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "b"
      ) {
        e.preventDefault();
        insertAtCursor("\\textbf{}");
      } else if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "i"
      ) {
        e.preventDefault();
        insertAtCursor("\\textit{}");
      } else if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "u"
      ) {
        e.preventDefault();
        insertAtCursor("\\underline{}");
      } else if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === "/") {
        e.preventDefault();
        handleToggleComment();
      } else if (
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        e.key.toLowerCase() === "m"
      ) {
        e.preventDefault();
        insertAtCursor("$  $");
      } else if (
        (e.ctrlKey || e.metaKey) &&
        e.shiftKey &&
        e.key.toLowerCase() === "m"
      ) {
        e.preventDefault();
        insertAtCursor("\\[\n\n\\]");
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onDownload, handleCompile, insertAtCursor, handleToggleComment]);

  // Duplicate problem fixed ✅
  const docs = useRef(new Map());

  // Hook Yjs + MonacoBinding to currentDocId and set up awareness
  useEffect(() => {
    if (currentDocId && monaco && editorRef.current) {
      // --- Cleanup any previous binding/provider ---
      if (bindingRef.current) {
        bindingRef.current.destroy?.();
        bindingRef.current = null;
      }
      if (providerRef.current) {
        providerRef.current.destroy();
        providerRef.current = null;
      }

      let ydoc = docs.current.get(currentDocId);
      if (!ydoc) {
        ydoc = new Y.Doc();
        docs.current.set(currentDocId, ydoc);
      }

      const yText = ydoc.getText("monaco");
      yTextRef.current = yText; // track current yText for outline updates

      const provider = new WebsocketProvider(
        "wss://api-iit-kgp-latex.demome.in:5004",
        currentDocId,
        ydoc
      );

      // Set up awareness (user presence)
      provider.awareness.setLocalStateField("user", {
        name: user?.name || "Anonymous",
        color: userColor,
        cursor: null
      });

      provider.once("synced", (isSynced) => {
        if (isSynced && yText.length === 0 && value) {
          // Insert initial content from props if no remote content is present
          yText.insert(0, value);
        }

        // Only create binding AFTER we are sure yText has correct content
        const model = editorRef.current.getModel();
        const binding = new MonacoBinding(
          yText,
          model,
          new Set([editorRef.current]),
          provider.awareness
        );

        bindingRef.current = binding;

        // Initial outline compute now that binding is ready
        scheduleOutlineUpdate();

        // Listen for awareness changes -> Cursor handle area
        provider.awareness.on("change", (changes) => {
          const statesArray = Array.from(provider.awareness.getStates());
          statesArray.forEach((state) => {
            const clientId = state[0];
            if (state[1].user) {
              const styleSheet = document.createElement("style");
              styleSheet.innerText = `
          .yRemoteSelectionHead-${clientId}{
            border-left: 2px solid ${state[1].user.color} ;
            position:relative;
          }
          .yRemoteSelectionHead-${clientId}::before {
            content: '${state[1].user.name}';
            color: white; 
            top: -15px;
            position:absolute;
            left: -2px;
            background-color:${state[1].user.color};
            font-size:10px;
            padding:2px;
            margin-bottom:8px;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            border-top-left-radius:5px;

          }
        `;
              document.head.appendChild(styleSheet);
            }
          });
        });
      });

      providerRef.current = provider;

      return () => {
        if (bindingRef.current?.cursorChangeDisposable) {
          bindingRef.current.cursorChangeDisposable.dispose();
        }
        bindingRef.current?.destroy?.();
        bindingRef.current = null;

        providerRef.current?.destroy();
        providerRef.current = null;
      };
    }
  }, [
    currentDocId,
    monaco,
    editorReady,
    value,
    user,
    userColor,
    forceRerender,
    scheduleOutlineUpdate
  ]);

  // Observe Y.Text to update the File Outline live with debouncing (handles remote and local Yjs updates)
  useEffect(() => {
    const yText = yTextRef.current;
    if (!yText) {
      // As a fallback, compute from the static value prop
      updateSectionTitlesFromText(value || "", null);
      return;
    }

    // Initial compute
    scheduleOutlineUpdate();

    const observer = () => {
      scheduleOutlineUpdate();
    };

    yText.observe(observer);
    return () => {
      yText.unobserve(observer);
    };
  }, [currentDocId, updateSectionTitlesFromText, scheduleOutlineUpdate, value]);

  // Also update outline immediately on Monaco content changes (for the snappiest local UX)
  useEffect(() => {
    if (!editorRef.current) return;
    const dispose = editorRef.current.onDidChangeModelContent(() => {
      scheduleOutlineUpdate();
    });
    return () => {
      try {
        dispose?.dispose?.();
      } catch {}
    };
  }, [currentDocId, scheduleOutlineUpdate]);

  // comparison panel sizes
  const [sizes, setSizes] = useState(isMobile ? [100, 0] : [50, 50]);
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  const collapsePanel = () => {
    if (leftRef.current) leftRef.current.collapse();
  };

  const expandPanel = () => {
    if (rightRef.current) {
      rightRef.current.collapse();
    }
  };

  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [isWriting, setIsWriting] = useState(false);

  
  // IMPLEMENT THE SHORTCUTS FOR MONACO EDITOR
  const handleEditorMount = (editor, monacoInstance) => {
    editorRef.current = editor;
    setEditorReady(true);

    // clear model before first sync
    const model = editor.getModel();
    if (model) model.setValue("");

    // Track typing
    let typingTimeout;

    // If any change happening in editor
    editor.onDidChangeModelContent(() => {
      // Show "user is writing"
      setIsWriting(true);

      // Record the time when writing starts
      const now = new Date();
      console.log("User started writing at:", now.toLocaleTimeString());

      // Reset timer
      if (typingTimeout) clearTimeout(typingTimeout);

      // Hide after 2 seconds of inactivity
      typingTimeout = setTimeout(() => {
        setIsWriting(false);
        // onSave();
        console.log("stop writing");
      }, 2000);
    });

    // === SHORTCUTS ===

    // Save
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyS,
      () => {
        const value = editor.getValue();
        onChange(value);
      }
    );

    // Download
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd |
        monacoInstance.KeyMod.Shift |
        monacoInstance.KeyCode.KeyD,
      () => {
        onDownload?.();
      }
    );

    // Compile
    // editor.addCommand(
    //   monacoInstance.KeyMod.CtrlCmd |
    //     monacoInstance.KeyMod.Shift |
    //     monacoInstance.KeyCode.KeyC,
    //   () => {
    //     handleCompile();
    //   }
    // );

    // Bold
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyB,
      () => insertAtCursor("\\textbf{}")
    );

    // Italic
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyI,
      () => insertAtCursor("\\textit{}")
    );

    // Underline
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyU,
      () => insertAtCursor("\\underline{}")
    );

    // Comment toggle
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.Slash,
      () => handleToggleComment()
    );

    // Inline math: Ctrl+M
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd | monacoInstance.KeyCode.KeyM,
      () => insertAtCursor("$  $")
    );

    // Display math: Ctrl+Shift+M
    editor.addCommand(
      monacoInstance.KeyMod.CtrlCmd |
        monacoInstance.KeyMod.Shift |
        monacoInstance.KeyCode.KeyM,
      () => insertAtCursor("\\[\n\n\\]")
    );

    // === Setup positioning for overlays ===
    const editorContainer = editor.getDomNode().parentNode;
    if (editorContainer && editorContainer.style) {
      editorContainer.style.position = "relative";
    }
  };

  // PREVIOUS USE CODES FOR EDITOR
  const getEditorView = () => {
    if (editorRef.current) {
      return editorRef.current; // this is the Monaco editor instance
    }
    return null;
  };

  const handleExecuteCommand = useCallback((command) => {
    const view = getEditorView();
    if (view) {
      command(view);
      view.focus();
    }
  }, []);

  const handleInsertOrWrap = useCallback(
    (startTag, endTag = "", block = false) => {
      const editor = getEditorView();
      if (!editor) return;

      const model = editor.getModel();
      const selection = editor.getSelection();
      const selectedText = model.getValueInRange(selection);

      let textToInsert = "";
      if (selectedText) {
        textToInsert = block
          ? `${startTag}\n${selectedText}\n${endTag}`
          : `${startTag}${selectedText}${endTag}`;
      } else {
        textToInsert = block
          ? `${startTag}\n\n${endTag}`
          : `${startTag}${endTag}`;
      }

      editor.executeEdits("", [
        {
          range: selection,
          text: textToInsert,
          forceMoveMarkers: true
        }
      ]);

      // Move cursor inside braces or block
      if (!selectedText) {
        const pos = editor.getPosition();
        editor.setPosition({
          lineNumber: pos.lineNumber,
          column: pos.column - endTag.length
        });
      }

      editor.focus();
    },
    []
  );

  const handleInsertBlock = useCallback(
    (text, cursorLineOffset = 1, cursorCharOffset = 0) => {
      const view = getEditorView();
      if (!view) return;
      const { state } = view;
      const changes = [];
      let finalCursorPos = state.selection.main.head;

      for (const range of state.selection.ranges) {
        changes.push({ from: range.from, to: range.to, insert: text });
        if (range.from === state.selection.main.from) {
          const insertedLines = text.split("\n").length - 1;
          const startLine = state.doc.lineAt(range.from);
          const targetLineNumber = Math.min(
            startLine.number + cursorLineOffset,
            startLine.number + insertedLines
          );
          const targetLineStart = state.doc.line(
            Math.min(targetLineNumber, state.doc.lines)
          ).from;
          finalCursorPos = targetLineStart + cursorCharOffset;
        }
      }
      view.dispatch({
        changes,
        selection: { anchor: finalCursorPos },
        userEvent: "input.toolbar"
      });
      view.focus();
    },
    []
  );

  return (
    <div className="h-screen w-screen relative flex flex-col border-gray-200 overflow-hidden">
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div
          className={`left-side flex flex-col ${
            sidebarToggle
              ? "w-[4%] max-[450px]:w-[10%]"
              : "w-[14%] max-[450px]:w-[40%]"
          } h-full bg-shadow max-[450px]:hidden`}
        >
          {/* Sidebar Toggle + Actions */}
          <div
            className={`flex items-center ${
              sidebarToggle ? "flex-col max-[450px]:h-max pt-5" : "h-[7vh]"
            } w-full justify-between lg:p-2 md:p-0`}
          >
            <Menu
              className="lg:text-3xl md:text-2xl max-[450px]:text-[25px] text-icon cursor-pointer"
              onClick={SideBarHandler}
            />
            <div
              className={`options flex items-center gap-1 ${
                sidebarToggle ? "flex-col mt-3 gap-2" : ""
              }`}
            >
              <DialogModal
                Icon={PlusIcon}
                btnName={"Create"}
                label={"Name"}
                inputValue={pageName}
                isLoading={isLoading}
                setInputValue={setPageName}
                submitHandler={handleAddPage}
                title={"Enter new page name (e.g. chapter1.tex):"}
                className={`w-5 h-5 cursor-pointer`}
              />
              <button
                className="text-icon hover:text-[#6d6e71] flex items-center cursor-pointer"
                title="Add new page"
                disabled={isLoading}
              >
                <ArrowUpOnSquareStackIcon className="w-5 h-5" />
              </button>
              <button
                className="text-icon hover:text-[#6d6e71] flex items-center cursor-pointer"
                title="Add new page"
                disabled={isLoading}
              >
                <FolderOpenIcon className="w-5 h-5 text-icon" />
              </button>
            </div>
          </div>

          {/* Pages List */}
          <ul
            className={`list-none cursor-pointer file-scrollbar ${
              fileOutLine ? "h-[87%]" : "h-[46%]"
            } overflow-y-auto`}
          >
            {!editorData || editorData.length === 0 ? (
              <li className="text-primary w-full text-center">
                No pages available.
              </li>
            ) : (
              <TreeProvider className={`${sidebarToggle ? "hidden" : ""}`}>
                <TreeView>
                  <TreeNode nodeId={"Main File"}>
                    <TreeNodeTrigger className={`hover:bg-light-shadow`}>
                      <TreeExpander hasChildren />
                      <TreeIcon hasChildren />
                      <TreeLabel>Main</TreeLabel>
                    </TreeNodeTrigger>
                    <TreeNodeContent hasChildren>
                      {editorData.map((page, idx) => (
                        <TreeNode
                          level={1}
                          key={page._id || idx}
                          nodeId={page._id || idx}
                        >
                          <TreeNodeTrigger
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePageSelect(idx);
                            }}
                          >
                            <TreeExpander />
                            <TreeIcon />
                            <TreeLabel>{page.page_name}</TreeLabel>
                            <button
                              className={`ml-2 text-primary hover:text-gray-800`}
                              title="Rename page"
                            >
                              <Popover>
                                <PopoverTrigger>
                                  <EllipsisVerticalIcon className="w-6 h-6 cursor-pointer" />
                                </PopoverTrigger>
                                <PopoverContent
                                  className={`w-30 flex flex-col gap-2`}
                                >
                                  {options.map((_, i) => (
                                    <a
                                      href={_.link}
                                      key={i}
                                      className="text-[14px] py-1 border-b hover:text-secondary"
                                    >
                                      {_.tag}
                                    </a>
                                  ))}
                                </PopoverContent>
                              </Popover>
                            </button>
                          </TreeNodeTrigger>
                        </TreeNode>
                      ))}
                    </TreeNodeContent>
                  </TreeNode>
                </TreeView>
              </TreeProvider>
            )}
          </ul>

          {/* File Outline */}
          <ul
            className={`list-none cursor-pointer ${
              fileOutLine ? "h-[7%]" : "h-[46%]"
            }`}
          >
            <h1
              className={`w-full flex justify-start items-center gap-1 text-primary px-4 py-2 ${
                sidebarToggle ? "hidden" : ""
              }`}
              onClick={() => setFileOutLine((prev) => !prev)}
            >
              <ChevronDownIcon className="w-4 h-4" /> File outline
            </h1>
            <div className="outline-topic overflow-y-auto file-scrollbar h-full">
              {sectionTitles.length === 0 && (
                <li
                  className={`text-primary w-full text-center ${
                    sidebarToggle ? "hidden" : ""
                  }`}
                >
                  No Section Titles found.
                </li>
              )}
              {sectionTitles.map((section, count) => (
                <li
                  key={`${section.title}-${section.index}-${count}`}
                  className={`flex items-center justify-between p-1 cursor-pointer ${
                    sidebarToggle ? "hidden" : ""
                  } hover:bg-[#745275] hover:text-white`}
                  onClick={() => handleSectionTitleClick(section)}
                >
                  <h3 className="w-full px-4 font-medium">
                    {count + 1}. {section.title}
                  </h3>
                </li>
              ))}
            </div>
          </ul>
        </div>

        {/* SIDEBAR FOR MOBILE  */}
        <div className="mobile-sidebar absolute bottom-5 w-full h-[10vh] z-20 flex items-center justify-end min-[500px]:hidden">
          <div
            className={clsx(
              "box h-[90%] flex items-center bg-white backdrop-blur-lg border-1 border-primary rounded-l-full transition-all duration-500 ease-in-out ",
              mobileSidebar ? "w-[95%] " : "w-[40px] justify-center"
            )}
          >
            <MdKeyboardDoubleArrowLeft
              className={clsx(
                "text-4xl mx-2 transition-all duration-500 ",
                mobileSidebar ? "rotate-180" : ""
              )}
              onClick={() => setMobileSidebar((prev) => !prev)}
            />

            {/* FILE STRUCTURE */}
            <div
              className={clsx(
                "dropdown dropdown-top dropdown-center ",
                mobileSidebar ? "block" : "hidden"
              )}
            >
              <div
                tabIndex={0}
                role="button"
                className="py-3 !px-6 rounded-md flex items-center"
              >
                Pages <IoIosArrowUp className="mt-1" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-shade rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {!editorData || editorData.length === 0 ? (
                  <li className="text-primary">No pages available.</li>
                ) : (
                  <TreeProvider className={`${sidebarToggle ? "hidden" : ""}`}>
                    <TreeView>
                      <TreeNode nodeId={"Main File"}>
                        <TreeNodeTrigger className={`hover:bg-light-shadow`}>
                          <TreeExpander hasChildren />
                          <TreeIcon hasChildren />
                          <TreeLabel>Main</TreeLabel>
                        </TreeNodeTrigger>
                        <TreeNodeContent hasChildren>
                          {editorData.map((page, idx) => (
                            <TreeNode
                              level={1}
                              key={page._id || idx}
                              nodeId={page._id || idx}
                            >
                              <TreeNodeTrigger
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handlePageSelect(idx);
                                }}
                              >
                                <TreeExpander />
                                <TreeIcon />
                                <TreeLabel>{page.page_name}</TreeLabel>
                                <button
                                  className={`ml-2 text-primary hover:text-gray-800`}
                                  title="Rename page"
                                >
                                  <Popover>
                                    <PopoverTrigger>
                                      <EllipsisVerticalIcon className="w-6 h-6 cursor-pointer" />
                                    </PopoverTrigger>
                                    <PopoverContent
                                      className={`w-30 flex flex-col gap-2`}
                                    >
                                      {options.map((_, i) => (
                                        <a
                                          href={_.link}
                                          key={i}
                                          className="text-[14px] py-1 border-b hover:text-secondary"
                                        >
                                          {_.tag}
                                        </a>
                                      ))}
                                    </PopoverContent>
                                  </Popover>
                                </button>
                              </TreeNodeTrigger>
                            </TreeNode>
                          ))}
                        </TreeNodeContent>
                      </TreeNode>
                    </TreeView>
                  </TreeProvider>
                )}
              </ul>
            </div>

            {/* OUTLINE STRUCTURE */}
            <div
              className={clsx(
                "dropdown dropdown-top dropdown-center ",
                mobileSidebar ? "block" : "hidden"
              )}
            >
              <div
                tabIndex={0}
                role="button"
                className="py-3 !px-6 rounded-md flex items-center"
              >
                Outlines <IoIosArrowUp className="mt-1" />
              </div>
              <ul
                tabIndex={0}
                className="dropdown-content menu bg-base-100 max-h-[300px] grid grid-cols-1 overflow-y-scroll rounded-box z-1 w-52 p-2 shadow-sm"
              >
                {sectionTitles.length === 0 && (
                  <li
                    className={`text-primary w-full text-center ${
                      sidebarToggle ? "hidden" : ""
                    }`}
                  >
                    No Section Titles found.
                  </li>
                )}
                {sectionTitles.map((section, count) => (
                  <li
                    key={`${section.title}-${section.index}-${count}`}
                    className={`flex items-center justify-between p-1 cursor-pointer ${
                      sidebarToggle ? "hidden" : ""
                    } hover:bg-[#745275] hover:text-white`}
                    onClick={() => handleSectionTitleClick(section)}
                  >
                    <h3 className="w-full px-4 font-medium">
                      {count + 1}. {section.title}
                    </h3>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div
          className={`right-side ${
            sidebarToggle
              ? "w-[96%] max-[450px]:w-[90%]"
              : "w-[86%] max-[450px]:60%"
          } flex flex-col flex-1 h-full min-h-0`}
        >
          <EditorToolbar
            value={value} // latex code
            onChange={onChange} // update the latex code
            onExecuteCommand={handleExecuteCommand}
            onInsertOrWrap={handleInsertOrWrap}
            onInsertBlock={handleInsertBlock}
            getEditorContent={getEditorContent}
            setEditorContent={setEditorContent}
            insertAtCursor={insertAtCursor}
            onToggleComment={handleToggleComment}
            compileHandler={handleCompile}
            saveHandler={handleCompile}
            pdfDownloadHandler={onDownload}
            isLoading={isLoading}
            statusMessage={statusMessage}
            errorLog={errorLog}
            shortcuts={SHORTCUTS}
          />
          <ResizablePanelGroup
            id="editor-panel-group"
            direction="horizontal"
            className="flex-1 min-h-0 w-full h-full bg-shadow pr-2 pb-2"
            layout={sizes}
            onLayout={setSizes}
          >
            {/* Left Panel */}
            <ResizablePanel
              id="editor-left-panel"
              ref={leftRef}
              collapsible
              minSize={10}
              className={cn(
                "b-left-part h-full flex flex-col justify-between min-h-0 relative",
                sizes[0] === 100 ? "rounded-md" : "rounded-l-md"
              )}
            >
              <div className="flex-1 w-full h-full rounded-md relative">
                <Editor
                  height="100%"
                  width="100%"
                  defaultLanguage="latex"
                  theme="noctisLilacMonaco"
                  onMount={handleEditorMount}
                  beforeMount={defineNoctisLilacTheme}
                  options={{
                    wordWrap: "on",
                    contextmenu: false,
                    minimap: { enabled: false },
                    fontSize: 18,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    readOnly: isLoading,
                    mouseWheelZoom: true
                  }}
                />
              </div>
            </ResizablePanel>

            {/* Right Panel (Preview) */}
            {pdfUrl ? (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel
                  id="editor-right-panel"
                  ref={rightRef}
                  collapsible
                  defaultSize={sizes[1]}
                  minSize={10}
                  className={cn(
                    "b-right-part h-full flex flex-col overflow-hidden min-h-0",
                    sizes[1] === 100 ? "rounded-md" : "rounded-r-md"
                  )}
                >
                  <PreviewPanel
                    pdfUrl={pdfUrl}
                    saveHandler={handleCompile}
                    collapsePanel={collapsePanel}
                    expandPanel={expandPanel}
                    isLoading={isLoading}
                    errorLog={errorLog}
                  />
                </ResizablePanel>
              </>
            ) : (
              <>
                <ResizableHandle
                  withHandle
                  className="max-[450px]:order-last"
                />
                <ResizablePanel
                  id="editor-right-panel"
                  ref={rightRef}
                  collapsible
                  defaultSize={sizes[1]}
                  minSize={10}
                  className={cn(
                    "b-right-part rounded-r-md h-full flex flex-col overflow-hidden min-h-0"
                  )}
                >
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    No preview available.
                  </div>
                </ResizablePanel>
              </>
            )}
          </ResizablePanelGroup>
        </div>
      </div>
    </div>
  );
};

export default EditorPanel;
