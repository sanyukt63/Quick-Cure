const Appointment = require('../models/appointmentModel');
const Doctor = require('../models/doctorModel');

// Book appointment
exports.book = async (req, res) => {
  try {
    const { doctorId, date, time } = req.body; // ISO date string + time label
    const doc = await Doctor.findById(doctorId);
    if (!doc) return res.status(404).json({ msg: 'Doctor not found' });

    // ensure slot exists and is free
    const day = (doc.schedule || []).find(
      (d) => new Date(d.date).toDateString() === new Date(date).toDateString()
    );
    if (!day) return res.status(400).json({ msg: 'No schedule for selected date' });

    const slot = day.slots.find((s) => s.time === time);
    if (!slot) return res.status(400).json({ msg: 'Invalid time slot' });
    if (slot.booked) return res.status(409).json({ msg: 'Slot already booked' });

    slot.booked = true;
    await doc.save();

    const appt = await Appointment.create({
      patient: req.user._id,
      doctor: doc._id,
      hospital: doc.hospital,
      date: new Date(date),
      time,
      status: 'booked',
      fees: doc.fees
    });

    return res.json({ msg: 'Appointment booked', appointment: appt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Patient: My appointments
/*exports.myAppointments = async (req, res) => {
  try {
    const appts = await Appointment.find({ patient: req.user._id })
      .populate('doctor', 'name specialization city fees')
      .populate('hospital', 'name city');
    return res.json(appts);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};*/

// Cancel appointment
exports.cancel = async (req, res) => {
  try {
    const { id } = req.params; // appointment id
    const appt = await Appointment.findOne({ _id: id, patient: req.user._id });
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });
    if (appt.status !== 'booked')
      return res.status(400).json({ msg: 'Cannot cancel this appointment' });

    // free the slot back
    const doc = await Doctor.findById(appt.doctor);
    const day = doc.schedule.find(
      (d) => new Date(d.date).toDateString() === new Date(appt.date).toDateString()
    );
    if (day) {
      const slot = day.slots.find((s) => s.time === appt.time);
      if (slot) slot.booked = false;
      await doc.save();
    }

    appt.status = 'canceled';
    await appt.save();
    return res.json({ msg: 'Appointment canceled' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

// Doctor/Admin: Complete appointment
exports.complete = async (req, res) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findById(id).populate('doctor');
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });

    if (appt.status !== 'booked')
      return res.status(400).json({ msg: 'Only booked appointments can be completed' });

    appt.status = 'completed';
    await appt.save();

    return res.json({ msg: 'Appointment marked as completed', appointment: appt });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};


// Patient: My appointments
exports.myAppointments = async (req, res) => {
  try {
    if (req.user.role === "patient") {
      const appts = await Appointment.find({ patient: req.user._id })
        .populate('doctor', 'name specialization city fees');
      return res.json(appts);
    } else if (req.user.role === "doctor") {
      const appts = await Appointment.find({ doctor: req.user.doctorId })
        .populate('patient', 'name email phone');
      return res.json(appts);
    } else {
      return res.status(403).json({ msg: "Not authorized" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

