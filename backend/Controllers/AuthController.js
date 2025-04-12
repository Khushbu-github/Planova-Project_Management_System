const User = require('../Models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
JWT_SECRET = process.env.JWT_SECRET;


const signup = async (req, res) => {
    try {
        const { name, email, password, role  } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists",
                success: false
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ name, email, password: hashedPassword, role  });

        await newUser.save();

        res.status(201).json({
            message: "User created successfully",
            success: true
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};


const login = async (req, res) => {
     try {
         const { email, password, role  } = req.body;
         const errMsg = 'Auth failed email or password is incorrect'; 
 
         const existingUser = await User.findOne({ email });
         if (!existingUser || existingUser.role !== role) {
            return res.status(400).json({
                message: errMsg,
                success: false
            });
        }
 
           const isPasswordValid = await bcrypt.compare(password, existingUser.password); 
           if (!isPasswordValid) {
                return res.status(400).json({
                     message: errMsg,
                     success: false
                });
               }
          const jwtToken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: '24H' });   

         res.status(200).json({
             message: "Login successfully",
             success: true,
                token: jwtToken,
                    user: {
                         id: existingUser._id,
                         name: existingUser.name,
                         email: existingUser.email,
                         role: existingUser.role
                    }
         });
 
     } catch (error) {
         console.error("Signup error:", error);
         res.status(500).json({
             message: "Internal server error",
             success: false
         });
     }
 };
 

module.exports = {
    signup,
     login
};
