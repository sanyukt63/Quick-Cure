const Doctor = require('../models/doctorModel');
const Hospital = require('../models/hospitalModel');
const Appointment = require('../models/appointmentModel');
const mongoose = require('mongoose');
// Doctor: My appointments
exports.doctorAppointments = async (req, res) => {
  try {
    const doc = await Doctor.findOne({ user: req.user._id });
    if (!doc) return res.status(404).json({ msg: 'Doctor not found' });

    const appts = await Appointment.find({ doctor: doc._id })
      .populate('patient', 'name email')
      .populate('hospital', 'name city')
      .sort({ date: 1 });

    return res.json(appts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

exports.doctorStats = async (req, res) => {
  try {
    const doc = await Doctor.findOne({ user: req.user._id });
    if (!doc) return res.status(404).json({ msg: 'Doctor not found' });

    const stats = await Appointment.aggregate([
      { $match: { doctor: new mongoose.Types.ObjectId(doc._id), status: 'completed' } },
      {
        $group: {
          _id: { year: { $year: '$date' }, month: { $month: '$date' } },
          totalEarnings: { $sum: '$fees' },
          totalAppointments: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': -1, '_id.month': -1 } }
    ]);

    return res.json(stats);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Get doctor profile
exports.getProfile = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'email role');
    if (!doctor) return res.status(404).json({ message: 'Doctor not found' });
    res.json({ profile: doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// Update doctor profile
exports.updateProfile = async (req, res)=> {
  try {
    const updates = req.body;
    const doctor = await Doctor.findOneAndUpdate(
      { user: req.user.id },
      { $set: updates },
      { new: true }
    );
    res.json({ profile: doctor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}









// Public search: specialization, city, earliest availability
exports.search = async (req, res) => {
const { q, specialization, city } = req.query;
const filter = {};
if (specialization) filter.specialization = new RegExp(`^${specialization}$`, 'i');
if (city) filter.city = new RegExp(city, 'i');
if (q) filter.$or = [{ name: new RegExp(q, 'i') }, { specialization: new RegExp(q, 'i') }];


const doctors = await Doctor.find(filter).populate('hospital', 'name city verified').lean();


// Rank by earliest available slot: find first unbooked slot date/time
const ranked = doctors.map((d) => {
let earliest = null;
for (const day of d.schedule || []) {
const free = (day.slots || []).find((s) => !s.booked);
if (free) {
earliest = { date: day.date, time: free.time };
break;
}
}
return { ...d, earliestAvailability: earliest };
}).sort((a, b) => {
const ad = a.earliestAvailability?.date ? new Date(a.earliestAvailability.date).getTime() : Infinity;
const bd = b.earliestAvailability?.date ? new Date(b.earliestAvailability.date).getTime() : Infinity;
return ad - bd;
});


res.json(ranked);
};


// Doctor (or admin) can set/update schedule
exports.setSchedule = async (req, res) => {
const { schedule } = req.body; // [{date, slots:[{time, booked:false}]}]
const doctorId = req.params.id;


// Only the owner doctor or admin can edit
const doc = await Doctor.findById(doctorId).populate('user');
if (!doc) return res.status(404).json({ msg: 'Doctor not found' });
if (req.user.role !== 'admin' && (!doc.user || String(doc.user._id) !== String(req.user._id))) {
return res.status(403).json({ msg: 'Forbidden' });
}


doc.schedule = schedule || [];
await doc.save();
res.json({ msg: 'Schedule saved', doctor: doc });
};


// Admin verify doctor
exports.verify = async (req, res) => {
const doctorId = req.params.id;
const doc = await Doctor.findByIdAndUpdate(doctorId, { verified: true }, { new: true });
if (!doc) return res.status(404).json({ msg: 'Doctor not found' });
res.json({ msg: 'Doctor verified', doctor: doc });
};


// Get doctor by id
exports.getById = async (req, res) => {
const doc = await Doctor.findById(req.params.id).populate('hospital', 'name city verified');
if (!doc) return res.status(404).json({ msg: 'Doctor not found' });
res.json(doc);
};


// List doctors (public)
exports.list = async (req, res) => {
const docs = await Doctor.find({}).select('-schedule').limit(100).lean();
res.json(docs);
};