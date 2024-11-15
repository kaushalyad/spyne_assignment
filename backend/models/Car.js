const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: String, required: false },
  images: { type: [String], required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Ensure this is required
}, { timestamps: true });

const Car = mongoose.model('Car', carSchema);

module.exports = Car;
