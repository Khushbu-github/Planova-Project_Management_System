const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const documentSchema = new Schema({
  studentId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Document', documentSchema);
