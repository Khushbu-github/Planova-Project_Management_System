const Message = require('../Models/message.model');
const User = require('../Models/User');

// Get messages between current user and selected user
const getMessages = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user.id;

    const messages = await Message.find({
      $or: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId }
      ]
    }).sort({ createdAt: 1 });

    return res.status(200).json({
      success: true,
      messages
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Send a message to the selected user
const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const senderId = req.user.id;
    const { text } = req.body;

    if (!text) {
      return res.status(400).json({
        message: "Message text is required",
        success: false
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text
    });

    await newMessage.save();

    // Socket.io events are handled in the index.js file directly now

    return res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

// Get all users for the sidebar (excluding the current user)
const getUsersForSidebar = async (req, res) => {
  try {
    const currentUserId = req.user.id;

    const users = await User.find({ _id: { $ne: currentUserId } })
      .select("-password");

    return res.status(200).json({
      success: true,
      users
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false
    });
  }
};

module.exports = {
  getMessages,
  sendMessage,
  getUsersForSidebar
}; 