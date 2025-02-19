//we are adding two layer of protection. 1st one is use is login or not, then role



const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/auth-middleware")

 const adminMiddleware = require("../middleware/admin-middleware")
//const isAdminUser = require("../middleware/admin-middleware")


router.get('/welcome',authMiddleware,adminMiddleware,(req,res)=>{

  
    res.json({
        message : "Welcome to the admin page",
        
    })
});



module.exports= router;