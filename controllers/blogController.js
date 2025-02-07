const Blog = require("../models/Blog");
const Comment = require("../models/Comment");

// Create a new blog
const createBlog = async (req, res) => {
 const { title, content, tags } = req.body;
 const author = req.user.id; // User ID from JWT

 try {
  const blog = new Blog({ title, content, tags, author });
  await blog.save();
  res.status(201).json(blog);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
 const page = parseInt(req.query.page) || 1; // Default to page 1
 const limit = parseInt(req.query.limit) || 10; // Default to 10 blogs per page
 try {
  const totalBlogs = await Blog.countDocuments(); // Total number of blogs
  const totalPages = Math.ceil(totalBlogs / limit); // Calculate total pages
  const blogs = await Blog.find()
   .populate("author", "username profilePicture") // Populate author details
   .skip((page - 1) * limit) // Skip blogs for previous pages
   .limit(limit); // Limit the number of blogs per page

  res.json({
   blogs,
   currentPage: page,
   totalPages,
  });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// Get a single blog by ID
const getBlogById = async (req, res) => {
 const { id } = req.params;
 try {
  const blog = await Blog.findById(id)
   .populate("author", "username profilePicture") // Populate blog author
   .populate({
    path: "comments", // Populate comments
    populate: { path: "author", select: "username profilePicture" }, // Populate comment author
   });
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  res.json(blog);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// Update a blog (only the author can update)
const updateBlog = async (req, res) => {
 const { id } = req.params;
 const { title, content, tags } = req.body;
 const userId = req.user.id;

 try {
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  // Check if the user is the author
  if (req.user.role != "admin" && blog.author.toString() !== userId) {
   return res.status(403).json({ message: "Unauthorized" });
  }

  blog.title = title || blog.title;
  blog.content = content || blog.content;
  blog.tags = tags || blog.tags;

  await blog.save();
  res.json(blog);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// Delete a blog (only the author or admin can delete)
const deleteBlog = async (req, res) => {
 const { id } = req.params;
 const userId = req.user.id;
 const userRole = req.user.role;
 try {
  const blog = await Blog.findById(id);
  if (!blog) return res.status(404).json({ message: "Blog not found" });
  if (blog.author.toString() !== userId && userRole !== "admin") {
   return res.status(403).json({ message: "Unauthorized" });
  }
  await Comment.deleteMany({ blogId: id });
  await Blog.findByIdAndDelete(id);
  res.json({ message: "Blog and associated comments deleted successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

const toggleComments = async (req, res) => {
 try {
  const { blogId } = req.params; // Blog ID from URL params
  // Find the blog
  const blog = await Blog.findById(blogId)
   .populate("author", "username profilePicture")
   .populate({
    path: "comments", // Populate comments
    populate: { path: "author", select: "username profilePicture" }, // Populate comment author
   });
  if (!blog) {
   return res.status(404).json({ message: "Blog not found" });
  }
  // Get the current logged-in user (assuming you're using JWT or sessions)
  const currentUser = req.user; // User ID from session or JWT token
  // Check if the current user is the author or an admin
  const isAdmin = currentUser.role === "admin";
  const isAuthor = blog.author._id.toString() === currentUser.id;
  if (!isAdmin && !isAuthor) {
   return res
    .status(403)
    .json({ message: "You are not authorized to modify this blog." });
  }
  // Toggle the commentsEnabled value
  blog.commentsEnabled = !blog.commentsEnabled;
  await blog.save();
  // Return the updated blog
  res.status(200).json({
   message: `Comments are now ${blog.commentsEnabled ? "enabled" : "disabled"}`,
   blog,
  });
 } catch (error) {
  console.error(error);
  res.status(500).json({ message: "Something went wrong" });
 }
};

module.exports = {
 createBlog,
 getAllBlogs,
 getBlogById,
 updateBlog,
 deleteBlog,
 toggleComments,
};
