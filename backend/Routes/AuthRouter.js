const { signup } = require("../Controllers/AuthController");
const { signupValidation } = require("../Middlewares/AuthValidation");
const { login } = require("../Controllers/AuthController");
const { loginValidation } = require("../Middlewares/AuthValidation"); 


const router = require("express").Router();



router.post('/login', loginValidation, login);
router.post('/signup', signupValidation, signup);
router.get('/logout', (req, res) => {
    res.send("Logout")
})

module.exports = router;