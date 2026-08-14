const Hospital = require('../models/hospitalModel');


exports.create = async (req, res) => {
const { name, type, city, address } = req.body;
const h = await Hospital.create({ name, type, city, address, verified: false });
res.json({ msg: 'Hospital submitted for verification', hospital: h });
};


exports.list = async (req, res) => {
const items = await Hospital.find().lean();
res.json(items);
};


exports.verify = async (req, res) => {
const id = req.params.id;
const updated = await Hospital.findByIdAndUpdate(id, { verified: true }, { new: true });
if (!updated) return res.status(404).json({ msg: 'Hospital not found' });
res.json({ msg: 'Hospital verified', hospital: updated });
};
