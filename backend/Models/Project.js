const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  submittedAt: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    default: "Submitted"
  }
});

module.exports = mongoose.model('Project', projectSchema);
