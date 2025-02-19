
const jwt = require('jsonwebtoken')


const authMiddleware =(req,res,next)=>{


    const authHeader = req.headers['authorization'];

    console.log("Auth middle ware is called",authHeader);

    const token = authHeader && authHeader.split(" ")[1];

    //if token not found
    if(!token){
     return res.status(401).json({
            success: false,
            message: "Access denied, no token provided. please login to continue",
          });
    }

//decode this token : means get the user information
try{
const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY)
console.log(decodedToken,"++");
req.userInfo = decodedToken;
next()
}
catch(error){
   return res.status(500).json({
        success: false,
        message: "Access denied, no token provided. please login to continue",
      });
}

   
}


module.exports = authMiddleware;