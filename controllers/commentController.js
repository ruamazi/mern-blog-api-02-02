const Comment = require("../models/Comment");
const Blog = require("../models/Blog");

// Create a new comment
const createComment = async (req, res) => {
 const { content, blogId } = req.body;
 const author = req.user.id; // User ID from JWT

 try {
  const blog = await Blog.findById(blogId);
  if (!blog) return res.status(404).json({ message: "Blog not found" });

  const comment = new Comment({ content, author, blog: blogId });
  await comment.save();
  blog.comments.push(comment._id);
  await blog.save();

  res.status(201).json(comment);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// Delete a comment (only admin or comment author can delete)
const deleteComment = async (req, res) => {
 const { id } = req.params;
 const userId = req.user.id;
 const userRole = req.user.role;

 try {
  const comment = await Comment.findById(id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  // Check if the user is the author or an admin
  if (comment.author.toString() !== userId && userRole !== "admin") {
   return res.status(403).json({ message: "Unauthorized" });
  }

  await Comment.findByIdAndDelete(id);
  res.json({ message: "Comment deleted successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

module.exports = { createComment, deleteComment };
