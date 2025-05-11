const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
        senderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // we are giving the reference to the User model
            required: true,
        },
        
        receiverId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // we are giving the reference to the User model
            required: true,
        },

        text: {
            type: String,
        },

        image: {
            type: String,
        },
    },{timestamps:true}
);

const Message = mongoose.model("Message",messageSchema);

module.exports = Message; // exporting the model so that we can use it in other files