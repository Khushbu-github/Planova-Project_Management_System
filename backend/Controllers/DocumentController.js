const Document = require('../Models/Document');
const User = require('../Models/User');

exports.uploadDocument = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'student') {
      return res.status(403).json({ message: 'Access denied: student only' });
    }

    const doc = new Document({
      studentId: req.user.id,
      title: req.body.title,
      filePath: req.file.path,
    });

    await doc.save();
    res.status(201).json({ message: 'Document uploaded successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
};

exports.getAllDocuments = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || user.role !== 'teacher') {
      return res.status(403).json({ message: 'Access denied: teacher only' });
    }

    const docs = await Document.find().populate('studentId', 'name');
    res.json(docs);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch documents', error: err.message });
  }
};
