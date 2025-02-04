const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Get user profile
const getProfile = async (req, res) => {
 try {
  const user = await User.findById(req.user.id).select("-password");
  res.json(user);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// Update user profile (e.g., profile picture)
const updateProfile = async (req, res) => {
 const { username, profilePicture } = req.body;
 try {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (username) user.username = username;
  if (profilePicture) user.profilePicture = profilePicture;

  await user.save();
  res.json(user);
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

// Change user password
const changePassword = async (req, res) => {
 const { oldPassword, newPassword } = req.body;

 try {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(oldPassword, user.password);
  if (!isMatch)
   return res.status(400).json({ message: "Invalid old password" });

  user.password = newPassword;
  await user.save();
  res.json({ message: "Password changed successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

module.exports = { getProfile, updateProfile, changePassword };
