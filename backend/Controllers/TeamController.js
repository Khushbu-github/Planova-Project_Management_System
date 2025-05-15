// TeamController.js
const Team = require('../Models/Team');
const User = require('../Models/User');

// Create a new team
const createTeam = async (req, res) => {
  try {
    const { name, problemStatement, memberIds, teacherId } = req.body;
    const leaderId = req.user.id;

    // Validate input
    if (!name || !problemStatement || !memberIds || !teacherId) {
      return res.status(400).json({
        message: 'All fields are required',
        success: false
      });
    }

    // Check if members exist and are students
    const members = await User.find({
      _id: { $in: [...memberIds, leaderId] },
      role: 'student'
    });

    // Ensure all members were found
    if (members.length !== memberIds.length + 1) {
      return res.status(400).json({
        message: 'One or more team members do not exist or are not students',
        success: false
      });
    }

    // Check if teacher exists
    const teacher = await User.findOne({
      _id: teacherId,
      role: 'teacher'
    });

    if (!teacher) {
      return res.status(400).json({
        message: 'Teacher not found',
        success: false
      });
    }

    // Get semester from leader (who is the current user)
    const leader = members.find(member => member._id.toString() === leaderId);
    const semester = leader.semester;

    // Create the team
    const team = new Team({
      name,
      problemStatement,
      members: [...memberIds, leaderId], // Include the leader in members
      leader: leaderId,
      teacher: teacherId,
      semester
    });

    await team.save();

    return res.status(201).json({
      message: 'Team created successfully',
      success: true,
      team
    });
  } catch (error) {
    console.error("Create team error:", error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

// Get teams for a student
const getStudentTeams = async (req, res) => {
  try {
    const studentId = req.user.id;

    const teams = await Team.find({ members: studentId })
      .populate('members', 'name email')
      .populate('teacher', 'name email')
      .populate('leader', 'name email');

    return res.status(200).json({
      success: true,
      teams
    });
  } catch (error) {
    console.error("Get student teams error:", error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

// Get teams for a teacher
const getTeacherTeams = async (req, res) => {
  try {
    const teacherId = req.user.id;

    const teams = await Team.find({ teacher: teacherId })
      .populate('members', 'name email semester')
      .populate('leader', 'name email semester');

    return res.status(200).json({
      success: true,
      teams
    });
  } catch (error) {
    console.error("Get teacher teams error:", error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

// Get all available students to select as team members
const getAvailableStudents = async (req, res) => {
  try {
    // Get all students
    const students = await User.find(
      { role: 'student' },
      'name email semester'
    );

    return res.status(200).json({
      success: true,
      students
    });
  } catch (error) {
    console.error("Get available students error:", error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

// Get all available teachers to select for team
const getAvailableTeachers = async (req, res) => {
  try {
    // Get all teachers
    const teachers = await User.find(
      { role: 'teacher' },
      'name email'
    );

    return res.status(200).json({
      success: true,
      teachers
    });
  } catch (error) {
    console.error("Get available teachers error:", error);
    return res.status(500).json({
      message: 'Internal server error',
      success: false
    });
  }
};

module.exports = {
  createTeam,
  getStudentTeams,
  getTeacherTeams,
  getAvailableStudents,
  getAvailableTeachers
};