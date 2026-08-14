const mongoose = require('mongoose');


const slotSchema = new mongoose.Schema(
{
date: { type: Date, required: true },
slots: [
{
time: { type: String, required: true }, // e.g. "10:00 AM"
booked: { type: Boolean, default: false }
}
]
},
{ _id: false }
);



const doctorSchema = new mongoose.Schema(
{
user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
hospital: { type: String },
name: { type: String, required: true },
specialization: { type: String, required: true },
licenseNumber: { type: String, required: true, unique: true },
yearsOfExperience: { type: Number, default: 0 },
city: { type: String },
qualification: { type: String },
bio:{ type: String },
fees: { type: Number, default: 500 },
verified: { type: Boolean, default: false },
schedule: [slotSchema],
rating: { type: Number, default: 0 },
reviewCount: { type: Number, default: 0 }
},
{ timestamps: true }
);


module.exports = mongoose.model('Doctor', doctorSchema);





