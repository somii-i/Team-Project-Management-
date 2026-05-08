const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['Active', 'Archived', 'Completed'], default: 'Active' }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
