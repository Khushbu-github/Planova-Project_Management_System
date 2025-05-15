    const mongoose = require("mongoose"); 
    const Schema = mongoose.Schema; 
    
    const userSchema = new Schema({ 
        name: { 
            type: String, 
            required: true 
        }, 
        email: { 
            type: String, 
            required: true, 
            unique: true 
        }, 
        password: { 
            type: String, 
            required: true 
        }, 
        role: { 
            type: String, 
            enum: ['student', 'teacher'], 
            required: true 
        },
    semester: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6, 7, 8],
        required: function() {
            return this.role === 'student';
        }
    }
    }); 
    
    const User = mongoose.model("User", userSchema); 
    module.exports = User;