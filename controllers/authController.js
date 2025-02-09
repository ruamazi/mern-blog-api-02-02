const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
 const { username, email, password } = req.body;
 try {
  const user = new User({ username, email, password });
  await user.save();
  res.status(201).json({ message: "User registered successfully" });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

const login = async (req, res) => {
 const { email, password } = req.body;
 try {
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "User not found" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign(
   { id: user._id, role: user.role, profilePicture: user.profilePicture },
   process.env.JWT_SECRET
  );
  res.json({
   token,
   user: {
    id: user._id,
    username: user.username,
    role: user.role,
    profilePicture: user.profilePicture,
   },
  });
 } catch (err) {
  res.status(500).json({ error: err.message });
 }
};

module.exports = { register, login };
