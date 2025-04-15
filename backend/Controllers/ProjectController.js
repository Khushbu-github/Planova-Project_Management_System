const Project = require('../Models/Project');

exports.submitProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const studentId = req.user.id; // from auth middleware

    const project = new Project({
      student: studentId,
      title,
      description
    });

    await project.save();
    res.status(201).json({ success: true, message: "Project submitted", project });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error submitting project" });
  }
};

exports.getMySubmissions = async (req, res) => {
  try {
    const studentId = req.user.id;
    const projects = await Project.find({ student: studentId });
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching submissions" });
  }
};

exports.getAllSubmissions = async (req, res) => {
  try {
    const projects = await Project.find().populate('student', 'name email');
    res.status(200).json({ success: true, projects });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching all submissions" });
  }
};
