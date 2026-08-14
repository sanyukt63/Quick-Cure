const router = require("express").Router();
const { authUser } = require("../middlewares/authMiddleware");
const {
  getPatientProfile,
  updatePatientProfile,
} = require("../controllers/patientController");

// ✅ Get current patient profile
router.get("/profile", authUser, getPatientProfile);

// ✅ Update patient profile
router.post("/update", authUser, updatePatientProfile);

module.exports = router;
