const mongoose = require('mongoose');


const appointmentSchema = new mongoose.Schema(
{
patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
hospital: { type: String },
date: { type: Date, required: true },
time: { type: String, required: true },
status: { type: String, enum: ['booked', 'completed', 'canceled'], default: 'booked' },
fees: { type: Number }
},
{ timestamps: true }
);


module.exports = mongoose.model('Appointment', appointmentSchema);