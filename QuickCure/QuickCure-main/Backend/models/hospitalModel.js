const mongoose = require('mongoose');


const hospitalSchema = new mongoose.Schema(
{
name: { type: String, required: true, trim: true },
type: { type: String},
city: { type: String, required: true },
address: { type: String },
verified: { type: Boolean, default: false }
},
{ timestamps: true }
);


module.exports = mongoose.model('Hospital', hospitalSchema);