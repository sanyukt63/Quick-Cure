const User = require("../models/userModel");

// GET /patients/profile
module.exports.getPatientProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }
    res.json({
      _id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    });
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// PUT /patients/update
module.exports.updatePatientProfile = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "patient") {
      return res.status(403).json({ message: "Access denied" });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    req.user.name = name;
    await req.user.save();

    res.json({
      message: "Profile updated successfully",
      profile: {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Error updating profile" });
  }
};
