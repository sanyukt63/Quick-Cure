const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');  // ⬅️ add this
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistTokenModel');

module.exports.authUser = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const isBlackListed = await blacklistTokenModel.findOne({ token: token });
  if (isBlackListed) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    // 🔹 If doctor, fetch the Doctor document and attach its _id
    if (user.role === "doctor") {
      const doctorDoc = await doctorModel.findOne({ user: user._id });
      if (doctorDoc) {
        req.user.doctorId = doctorDoc._id; // store doctorModel._id
      }
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
