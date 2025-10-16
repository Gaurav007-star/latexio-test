// Dotenv configuration
require("dotenv").config();

const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const logEvent = require("../utils/logEvent");
const User = require("../models/User");
const Project = require("../models/Projects");
const CollaboratorRequest = require("../models/CollaboratorRequest");
const emailConfig = require("../utils/emailConfig");
const sendEmail = emailConfig && (emailConfig.sendEmail || emailConfig.default || emailConfig);

// Load JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET environment variable is not set.");
}

// Middleware to validate token and attach user to the request
const authenticateToken = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded.user;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ success: false, error: "User not found." });
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: "Invalid token." });
  }
};

// ROUTE: Create a new project
router.post("/create", authenticateToken, async (req, res) => {
    let success = false;
    try {
      const { title, description, template, projectType } = req.body;
  
      // Input validation
      if (!title) {
        return res.status(400).json({ success, error: "Project name title is required." });
      }
  
      // Construct the payload
      const payload = {
        user_id: req.user.id,
        title,
        description,
        template,
        projectType,
        created_at: new Date(),
        last_accessed: new Date(),
        last_accessed_by: req.user.id,
        last_accessed_ip: req.ip,
        last_accessed_user_agent: req.headers["user-agent"],
        status: "active",
        collaborators: [],
        editor: [{
            page_name: "main.tex",
            pg_content: `\\documentclass{article}\n\\begin{document}\nHello, ${title}!\n\\end{document}`,
        }],
        deleted: false,
      };
  
      // Initialize a new project instance
      const project = new Project(payload);
  
      // Save the project to the database
      const savedProject = await project.save();
      success = true;
  
      // Respond with the created project details
      res.status(201).json({
        success,
        message: "Project created successfully.",
        editorId: savedProject.editor[0]._id,
        projectId: savedProject._id,
      });
  
      // Log the event
      logEvent("info", "PROJECT_CREATED", "Project created successfully.", {
        userId: req.user.id,
        projectId: savedProject._id,
      });
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ success: false, error: "Internal Server Error" });
    }
  });

// ROUTE 2: Update a project
router.put("/update/title/:id", authenticateToken, async (req, res) => {
  let success = false;
  try {
    const { id } = req.params;
    const { title } = req.body;

    // Check if at least one field is provided for update
    if (!title) {
      return res.status(400).json({ success, error: "Project title is required for update." });
    }

    // Send Only the fields that updated
    const updatedFields = {};
    if (title) updatedFields.title = title;
    updatedFields.last_accessed = Date.now();
    updatedFields.last_accessed_by = req.user.id;
    updatedFields.last_accessed_ip = req.ip;
    updatedFields.last_accessed_user_agent = req.headers["user-agent"];

    // Find the project and update and return the updated document only the fields that were updated

    const updatedProject = await Project.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      { $set: updatedFields },
      { new: true, projection: updatedFields }
    );

    if (!updatedProject) {
      return res.status(404).json({ success, error: "Project not found or unauthorized." });
    }

    success = true;
    res.status(200).json({ success, message: "Project title updated successfully.", project: updatedProject });
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 3: Archive a project
router.put("/archive/:id", authenticateToken, async (req, res) => {
  let success = false;
  try {
    const { id } = req.params;

    const archivedProject = await Project.findOneAndUpdate(
      { _id: id, user_id: req.user.id },
      { $set: { status: "archived", last_accessed: Date.now() } },
      { new: true }
    );

    if (!archivedProject) {
      return res.status(404).json({ success, error: "Project not found or unauthorized." });
    }

    success = true;
    res.status(200).json({ success, message: "Project archived successfully.", project: archivedProject });
  } catch (error) {
    console.error("Error archiving project:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 4: Delete a project (soft or hard)
router.delete("/delete/:id", authenticateToken, async (req, res) => {
  let success = false;
  try {
    const { id } = req.params;
    const { delete_mode, delete_reason } = req.body;

    if (delete_mode === "hard") {
      const deletedProject = await Project.findOneAndDelete({ _id: id, user_id: req.user.id });

      if (!deletedProject) {
        return res.status(404).json({ success, error: "Project not found or unauthorized." });
      }

      success = true;
      res.status(200).json({ success, message: "Project permanently deleted." });
    } else {
      const softDeletedProject = await Project.findOneAndUpdate(
        { _id: id, user_id: req.user.id },
        {
          $set: {
            deleted: true,
            deleted_at: Date.now(),
            deleted_by: req.user.id,
            deleted_reason,
            deleted_mode: "soft",
          },
        },
        { new: true }
      );

      if (!softDeletedProject) {
        return res.status(404).json({ success, error: "Project not found or unauthorized." });
      }

      success = true;
      res.status(200).json({ success, message: "Project soft-deleted successfully.", project: softDeletedProject });
    }
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 5: Get all projects for a user
router.get("/all", authenticateToken, async (req, res) => {
  let success = false;
  try {
    // const projects = await Project.find({ user_id: req.user.id, deleted: false }).sort({ created_at: -1 });
    const projects = await Project.find({ deleted: false }).sort({ created_at: -1 });
    success = true;
    res.status(200).json({ success, projects });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 6: Get a specific project by ID
router.get("/:id", authenticateToken, async (req, res) => {
  let success = false;
  try {
    const { id } = req.params;
    // const project = await Project.findOne({ _id: id, user_id: req.user.id, deleted: false });
    const project = await Project.findOne({ _id: id, deleted: false });

    if (!project) {
      return res.status(404).json({ success, error: "Project not found or unauthorized." });
    }

    success = true;
    res.status(200).json({ success, project });
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 7: Send Project Invitation (Collaborator Request) with a email notification
router.post("/invite/:id", authenticateToken, async (req, res) => {
  let success = false;
  try {
    const { id } = req.params;
    const { email } = req.body;

    // Input validation
    if (!email) {
      return res.status(400).json({ success, error: "Recipient email is required." });
    }


    // Find the project
    const project = await Project.findOne({ _id: id, user_id: req.user.id, deleted: false });
    if (!project) {
      return res.status(404).json({ success, error: "Project not found or unauthorized." });
    }

    // Create a collaborator request
    const collaboratorRequest = await CollaboratorRequest.createIfNotPending({
      requester: req.user.id,
      recipient: email,
      project: project._id,
      message: `You have been invited to collaborate on the project "${project.projectName}".`,
      expiresAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // Expires in 3 days
      meta: { invitedBy: req.user.id },
    });

    if (!collaboratorRequest) {
      return res.status(409).json({ success, error: "Pending invitation already exists." });
    }
    // Get the recipient name from the user collection find by the username=email
    const recipientUser = await User.findOne({ email });
    const recipientName = recipientUser ? recipientUser.name : "User";
    // Generate a secure token for the invitation (valid for 3 days)
    const tokenPayload = {
      requestId: collaboratorRequest._id,
    };
    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: '3d' });
    collaboratorRequest.token = token;
    await collaboratorRequest.save();

    // TODO: Send email notification to the recipient
    const emailSubject = `Invitation to collaborate on project "${project.title}"`;
    const emailBody = `
      <p>Hello ${recipientName},</p>
      <p>You have been invited to collaborate on the project "${project.title}".</p>
      <p>Please click the link below to accept the invitation:</p>
      <p><a href="${process.env.FRONTEND_URL || 'https://latexio.com'}/projects/${project._id}/invite?token=${collaboratorRequest.token}">Accept Invitation</a></p>
    `;
    if (typeof sendEmail !== "function") {
      console.error("sendEmail is not a function or not exported correctly.", emailConfig);
      return res.status(500).json({ success: false, error: "Email service unavailable." });
    }

    await sendEmail({
      to: email,
      subject: emailSubject,
      html: emailBody,
    });
    success = true;
    res.status(200).json({ success, message: "Project invitation sent successfully." });
  } catch (error) {
    console.error("Error sending project invitation:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

// ROUTE 8: Get all collaborator requests by the user id where the user is the recipient and the user is requester based on the project id
router.get("/collaborators/:projectId", authenticateToken, async (req, res) => {
  let success = false;
  try {
    const userId = req.user.id;
    const projectId = req.params.projectId;

    // Find all collaborator requests for the specific project
    const collaboratorRequests = await CollaboratorRequest.find({
      project: projectId,
      $or: [{ recipient: userId }, { requester: userId }],
    });
    // const custom response payload with requester name and recipient name from user collection
    const userIds = collaboratorRequests.map(req => req.requester).concat(collaboratorRequests.map(req => req.recipient));
    const users = await User.find({ email: { $in: userIds } });
    const userMap = Object.fromEntries(users.map(user => [user.email, user.name]));

    const responsePayload = collaboratorRequests.map(req => ({
      ...req.toObject(),
      requesterName: userMap[req.requester] || "Unknown",
      recipientName: userMap[req.recipient] || "Unknown",
    }));

    success = true;
    res.status(200).json({ success, collaboratorRequests: responsePayload });
  } catch (error) {
    console.error("Error fetching collaborator requests:", error);
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
});

module.exports = router;