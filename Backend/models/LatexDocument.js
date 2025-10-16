const mongoose = require("mongoose");

const LatexDocumentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  lastSaved: { type: Date, default: Date.now },
});

module.exports = mongoose.model("LatexDocument", LatexDocumentSchema);