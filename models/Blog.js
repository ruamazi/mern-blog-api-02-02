const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
 title: { type: String, required: true },
 content: { type: String, required: true },
 author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
 tags: [{ type: String }],
 comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }], // Add comments field
 commentsEnabled: { type: Boolean, default: true },
 createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);
