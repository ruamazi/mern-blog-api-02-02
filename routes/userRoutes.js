const express = require("express");
const {
 getProfile,
 updateProfile,
 changePassword,
 changeRole,
 getUserByUsername,
 change,
} = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.put("/change-role/:id", authMiddleware, changeRole);
router.get("/user/:username", getUserByUsername);
router.get("/userr/:id", change);

module.exports = router;
