const express = require('express');
const { verifyToken } = require('../Middlewares/AuthMiddleware');
const { getMessages, sendMessage, getUsersForSidebar } = require('../Controllers/MessageController');

const router = express.Router();

router.get("/users", verifyToken, getUsersForSidebar);

router.get("/:id", verifyToken, getMessages); // here id is a route parameter i.e, it is not static it is dynamic that means it can change according to our code

router.post("/send/:id", verifyToken, sendMessage);

module.exports = router;