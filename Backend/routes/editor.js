"use strict";

const express = require("express");
const { spawn } = require("child_process");
const { mkdtemp, writeFile, readFile, rm, mkdir } = require("fs/promises");
const path = require("path");
const os = require("os");
const { randomUUID } = require("crypto");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");
const multer = require("multer");
const mongoose = require("mongoose");
const axios = require("axios");

// Models
const LatexDocument = require("../models/Projects");
const ProjectAssets = require("../models/ProjectsAssets");

const router = express.Router();

// --- Configuration ---
const PDFLATEX_PATH = process.env.PDFLATEX_PATH || "pdflatex";
const PDFLATEX_RUNS = 2;
const PDFLATEX_PER_RUN_TIMEOUT_MS = Number(process.env.PDFLATEX_TIMEOUT_MS || 30000);
const MAX_LATEX_SIZE = Number(process.env.MAX_LATEX_SIZE || 2_000_000);
const ALLOW_REMOTE_IMAGES = process.env.ALLOW_REMOTE_IMAGES === "true";

const UPLOAD_DIR = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Multer setup for image uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
    filename: (_req, file, cb) => {
      const ext = (path.extname(file.originalname) || "").toLowerCase();
      const allowedExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".svg"];
      let safeExt = allowedExts.includes(ext) ? ext : ".bin";
      // Fallback by MIME if extension is missing/untrusted
      if (safeExt === ".bin") {
        const type = (file.mimetype || "").toLowerCase();
        if (type === "image/jpeg") safeExt = ".jpg";
        else if (type === "image/png") safeExt = ".png";
        else if (type === "image/gif") safeExt = ".gif";
        else if (type === "image/webp") safeExt = ".webp";
        else if (type === "image/svg+xml") safeExt = ".svg";
        else if (type === "application/pdf") safeExt = ".pdf";
      }
      cb(null, `image-${uuidv4()}${safeExt}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "application/pdf",
    ];
    if (allowed.includes((file.mimetype || "").toLowerCase())) return cb(null, true);
    cb(new Error("Unsupported file type"));
  },
});

// --- Helpers ---
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

async function runPdflatex({ tempDir, texFilePath, jobName = "output", runs = PDFLATEX_RUNS }) {
  const argsBase = [
    "-interaction=nonstopmode",
    "-halt-on-error",
    "-no-shell-escape",
    `-output-directory=${tempDir}`,
    `-jobname=${jobName}`,
    texFilePath,
  ];

  for (let i = 0; i < runs; i++) {
    await spawnOnce(PDFLATEX_PATH, argsBase, { cwd: tempDir, timeoutMs: PDFLATEX_PER_RUN_TIMEOUT_MS });
  }
}

function spawnOnce(cmd, args, { cwd, timeoutMs }) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { cwd, stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";

    const timer = setTimeout(() => {
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0) return resolve({ code, stdout, stderr });
      const err = new Error(`pdflatex exited with code ${code}`);
      err.code = code;
      err.stdout = stdout;
      err.stderr = stderr;
      reject(err);
    });
  });
}

function hasRemoteOrDataGraphics(latex) {
  const re = /\\includegraphics(?:\[[^\]]*\])?\{([^}]+)\}/gi;
  let match;
  while ((match = re.exec(latex))) {
    const arg = (match[1] || "").trim().toLowerCase();
    if (arg.startsWith("http://") || arg.startsWith("https://") || arg.startsWith("data:")) return true;
  }
  return false;
}

// Utility: Find all remote image URLs in LaTeX code
function findRemoteGraphics(latex) {
  const regex = /\\includegraphics(?:\[[^\]]*\])?\{(https?:\/\/[^\}]+)\}/gi;
  const found = [];
  let match;
  while ((match = regex.exec(latex))) {
    found.push(match[1]);
  }
  return found;
}

// Utility: download image and return local filename
async function downloadImage(url, tempDir, idx) {
  let ext = path.extname(url.split("?")[0]) || ".jpg";
  if (![".jpg", ".jpeg", ".png", ".gif", ".webp", ".pdf", ".svg"].includes(ext)) ext = ".jpg";
  const filename = `image${idx}${ext}`;
  const filepath = path.join(tempDir, filename);

  const response = await axios.get(url, { responseType: "arraybuffer" });
  await writeFile(filepath, response.data);
  return filename;
}

// --- Routes ---

// GET: Load the most recently saved document
router.get("/loadLast/:id", async (req, res) => {
  const { id } = req.params;
  if (!id || !isValidObjectId(id)) {
    return res.status(400).json({ success: false, error: "Invalid or missing editor ID." });
  }

  try {
    const lastDoc = await LatexDocument.findOne({ "editor._id": id }).sort({ "editor.lastSaved": -1 });
    if (!lastDoc) {
      return res.status(404).json({ success: false, error: "Document not found." });
    }
    const editorEntry = (lastDoc.editor || []).find((e) => String(e._id) === String(id));
    if (!editorEntry) {
      return res.status(404).json({ success: false, error: "Editor entry not found." });
    }
    return res.json({ success: true, content: editorEntry, projectId: lastDoc._id });
  } catch (error) {
    console.error("Error loading document:", error);
    return res.status(500).json({ success: false, error: "Failed to load document from database." });
  }
});

// POST: Save or Update editor content in a project
router.post("/save", async (req, res) => {
  const { code, editorId, projectId } = req.body;

  if (typeof code !== "string" || !editorId || !projectId) {
    return res.status(400).json({
      success: false,
      error: "Required fields (code, editorId, projectId) are missing.",
    });
  }
  if (code.length > MAX_LATEX_SIZE) {
    return res.status(413).json({ success: false, error: "LaTeX content too large." });
  }
  if (!isValidObjectId(editorId) || !isValidObjectId(projectId)) {
    return res.status(400).json({ success: false, error: "Invalid editorId or projectId." });
  }

  try {
    const savedDoc = await LatexDocument.findOneAndUpdate(
      { _id: projectId, "editor._id": editorId },
      {
        $set: {
          "editor.$.pg_content": code,
          "editor.$.lastSaved": new Date(),
        },
        $setOnInsert: { last_accessed: new Date() },
      },
      { new: true, runValidators: true }
    );

    if (!savedDoc) {
      return res.status(404).json({
        success: false,
        error: `Editor with ID ${editorId} or Project with ID ${projectId} not found.`,
      });
    }

    res.json({
      success: true,
      message: "Editor content saved successfully!",
      projectId: savedDoc._id,
      editorId,
    });
  } catch (error) {
    console.error("Error saving editor content:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save editor content to the database.",
    });
  }
});

// POST: Compile LaTeX Code (now supports remote images)
router.post("/compile", async (req, res) => {
  let latexCode = req.body?.latex_code;

  if (typeof latexCode !== "string" || latexCode.length === 0) {
    return res.status(400).json({ success: false, error: "No LaTeX code provided." });
  }
  if (latexCode.length > MAX_LATEX_SIZE) {
    return res.status(413).json({ success: false, error: "LaTeX content too large." });
  }

  if (!ALLOW_REMOTE_IMAGES && hasRemoteOrDataGraphics(latexCode)) {
    return res.status(400).json({
      success: false,
      error:
        "Remote or data URI images are not allowed. Please upload the image and reference a local filename, or enable ALLOW_REMOTE_IMAGES=true with a secure downloader.",
    });
  }

  let tempDir;
  const baseFileName = "output";

  try {
    const tempDirPrefix = path.join(os.tmpdir(), `latex-compile-${randomUUID()}-`);
    tempDir = await mkdtemp(tempDirPrefix);
    await mkdir(tempDir, { recursive: true });

    // --- Remote image support ---
    if (ALLOW_REMOTE_IMAGES) {
      const remoteImages = findRemoteGraphics(latexCode);
      let imgCount = 1;
      for (const url of remoteImages) {
        try {
          const localName = await downloadImage(url, tempDir, imgCount++);
          latexCode = latexCode.replace(url, localName); // Only replace the specific match
        } catch (err) {
          return res.status(400).json({
            success: false,
            error: `Failed to download image: ${url}\n${err.message}`,
          });
        }
      }
    }

    const texFilePath = path.join(tempDir, `${baseFileName}.tex`);
    const pdfFilePath = path.join(tempDir, `${baseFileName}.pdf`);
    const logFilePath = path.join(tempDir, `${baseFileName}.log`);

    await writeFile(texFilePath, latexCode, "utf8");

    try {
      await runPdflatex({ tempDir, texFilePath, jobName: baseFileName, runs: PDFLATEX_RUNS });
    } catch (e) {
      const logContent = await readFile(logFilePath, "utf8").catch(() => "");
      const errorMsg = [
        `PDF generation failed.`,
        e && e.message ? `Error: ${e.message}` : "",
        logContent ? "Log:\n" + logContent : "",
      ]
        .filter(Boolean)
        .join("\n\n");
      return res.status(500).json({
        success: false,
        error: errorMsg,
      });
    }

    const pdfBuffer = await readFile(pdfFilePath);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'inline; filename="output.pdf"');
    return res.send(pdfBuffer);
  } catch (error) {
    console.error("Error during LaTeX compilation:", error);
    return res.status(500).json({ success: false, error: "An error occurred during LaTeX compilation." });
  } finally {
    if (tempDir) {
      try {
        await rm(tempDir, { recursive: true, force: true });
      } catch (cleanupError) {
        console.error("Error cleaning up temporary directory:", cleanupError);
      }
    }
  }
});

// POST: addPage a new LaTeX document
router.post("/addPage", async (req, res) => {
  const { projectId, page_name: pageName, content } = req.body;

  if (!projectId || typeof pageName !== "string") {
    return res.status(400).json({
      success: false,
      error: "Required fields (projectId, page_name) are missing.",
    });
  }
  if (!isValidObjectId(projectId)) {
    return res.status(400).json({ success: false, error: "Invalid projectId." });
  }

  try {
    const newEditorEntry = {
      page_name: pageName.trim(),
      pg_content: typeof content === "string" ? content : "",
      lastSaved: new Date(),
    };

    const updatedProject = await LatexDocument.findByIdAndUpdate(
      projectId,
      { $push: { editor: newEditorEntry } },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${projectId} not found.`,
      });
    }

    res.json({
      success: true,
      message: "New page added successfully!",
      page: newEditorEntry,
      projectId: updatedProject._id,
    });
  } catch (error) {
    console.error("Error adding new page:", error);
    res.status(500).json({
      success: false,
      error: "Failed to add new page to the project. " + error.message,
    });
  }
});

// PUT: Rename a page
router.put("/renamePage", async (req, res) => {
  const { projectId, pageId, new_page_name } = req.body;

  if (!projectId || !pageId || typeof new_page_name !== "string") {
    return res.status(400).json({
      success: false,
      error: "Required fields (projectId, pageId, new_page_name) are missing.",
    });
  }
  if (!isValidObjectId(projectId) || !isValidObjectId(pageId)) {
    return res.status(400).json({ success: false, error: "Invalid projectId or pageId." });
  }

  try {
    const updatedProject = await LatexDocument.findOneAndUpdate(
      { _id: projectId, "editor._id": pageId },
      { $set: { "editor.$.page_name": new_page_name.trim() } },
      { new: true, runValidators: true }
    );

    if (!updatedProject) {
      return res.status(404).json({
        success: false,
        error: `Project with ID ${projectId} or Editor with ID ${pageId} not found.`,
      });
    }

    res.json({
      success: true,
      message: "Page renamed successfully!",
      projectId: updatedProject._id,
      pageId,
      new_page_name,
    });
  } catch (error) {
    console.error("Error renaming page:", error);
    res.status(500).json({
      success: false,
      error: "Failed to rename page in the project.",
    });
  }
});

router.post("/uploadImage", upload.single("image"), async (req, res) => {
  const { projectId } = req.body; // If you need pageId
  const file = req.file;

  if (!projectId || !file /* || !pageId if required */) {
    return res.status(400).json({
      success: false,
      error: "Required fields (projectId, image) are missing.",
    });
  }
  // Only validate pageId if required
  if (!isValidObjectId(projectId) /* || !isValidObjectId(pageId) if required */) {
    try {
      fs.unlinkSync(file.path);
    } catch (_) {}
    return res.status(400).json({ success: false, error: "Invalid project Id!" });
  }

  try {
    const name = file.filename;
    const relativePath = path.join("uploads", name);

    const assetRecord = new ProjectAssets({
      projectId,
      name,
      url: relativePath,
      uploadedAt: new Date(),
    });
    await assetRecord.save();

    res.json({
      success: true,
      message: "Image uploaded and asset record saved successfully!",
      name,
      projectId,
      url: relativePath,
      assetId: assetRecord._id,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    try {
      fs.unlinkSync(file.path);
    } catch (_) {}
    res.status(500).json({ success: false, error: "Failed to upload image and save asset." });
  }
});

module.exports = router;