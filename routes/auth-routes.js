const express = require("express");
const router = express.Router();
const {registerUser,loginUser,changedPassword}=require('../controllers/auth-controllers')
const authMiddleware = require ('../middleware/auth-middleware')
//all the routes that are related to authentication and authorization only

router.post('/register',registerUser);
router.post('/login',loginUser);
router.post('/changed-password',authMiddleware,changedPassword);


module.exports= router;