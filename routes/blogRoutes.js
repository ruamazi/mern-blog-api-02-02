const express = require("express");
const {
 createBlog,
 getAllBlogs,
 getBlogById,
 updateBlog,
 deleteBlog,
 toggleComments,
} = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);

// Protected routes (require authentication)
router.post("/", authMiddleware, createBlog);
router.put("/:id", authMiddleware, updateBlog);
router.delete("/:id", authMiddleware, deleteBlog);
router.patch("/:blogId/toggle-comments", authMiddleware, toggleComments);

module.exports = router;
