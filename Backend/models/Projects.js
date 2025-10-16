const mongoose = require("mongoose");
const { Schema } = mongoose;

const ProjectsSchema = new Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  tags: {
    type: [String],
  },
  template: {
    type: String,
  },
  projectType: {
    type: String,
    required: true,
    enum: ["public", "private"],
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  last_accessed: {
    type: Date,
    default: Date.now,
  },
  last_accessed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  last_accessed_ip: {
    type: String,
  },
  last_accessed_user_agent: {
    type: String,
  },
  status: {
    type: String,
    enum: ["active", "archived"],
    default: "active",
  },
  editor: [
    {
      page_name: {
        type: String,
        default: "main.tex",
      },
      pg_content: {
        type: String,
        default: "",
      },
      lastSaved: {
        type: Date,
        default: Date.now,
      },
    }
  ],
  collaborators: [
    {
      user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user",
      },
      role: {
        type: String,
        enum: ["viewer", "editor", "admin"],
        default: "viewer",
      },
    },
  ],
  deleted: {
    type: Boolean,
    default: false,
  },
  deleted_at: {
    type: Date,
  },
  deleted_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  deleted_reason: {
    type: String,
  },
  deleted_ip: {
    type: String,
  },
  deleted_user_agent: {
    type: String,
  },
  deleted_mode: {
    type: String,
    enum: ["soft", "hard", "none"],
    default: "none",
  },
});

module.exports = mongoose.model("Projects", ProjectsSchema);
