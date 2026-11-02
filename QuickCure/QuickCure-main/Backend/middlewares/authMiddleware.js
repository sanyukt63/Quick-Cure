const userModel = require('../models/userModel');
const doctorModel = require('../models/doctorModel');  // ⬅️ add this
const jwt = require('jsonwebtoken');
const blacklistTokenModel = require('../models/blacklistTokenModel');

module.exports.authUser = async (req, res, next) => {
  const authorization = req.headers.authorization || '';
  const bearerToken = authorization.match(/^Bearer\\s+(.+)$/i)?.[1];
  const token = req.cookies?.token || bearerToken;

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const isBlackListed = await blacklistTokenModel.findOne({ token });
    if (isBlackListed) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded._id);
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    req.user = user;

    if (user.role === "doctor") {
      const doctorDoc = await doctorModel.findOne({ user: user._id });
      if (doctorDoc) {
        req.user.doctorId = doctorDoc._id;
      }
    }

    return next();
  } catch (err) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
