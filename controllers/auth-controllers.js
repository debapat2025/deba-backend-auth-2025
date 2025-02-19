const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//register controller

const registerUser = async (req, res) => {
  try {
    //extract user information from our request body
    const { username, email, password, role } = req.body;

    //check if the user is already exist in our database
    const checkExistinguser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (checkExistinguser) {
      return res.status(400).json({
        success: false,
        message:
          "user already exists with eiter same username or same email. Please try with different user name or email",
      });
    }

    //hash user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    //create a new user and save in  your database
    const newlyCreatedUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "user",
    });

    await newlyCreatedUser.save();

    if (newlyCreatedUser) {
      res.status(201).json({
        success: true,
        message: "User is Registrtered successfully",
      });
    } else {
      res.status(400).json({
        success: false,
        message: "enable to register user,please try again",
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

//login controller

const loginUser = async (req, res) => {
  try {
     //extract user information from our request body
     const { username, password} = req.body;
//find if the current user is exit in database or not

const user = await User.findOne({username});

if (!user) {
  return res.status(400).json({
    success: false,
    message:"Username not found"
     
  });
}

//match if the password is correct or not
const isPasswordmatch = await bcrypt.compare(password,user.password)

if(!isPasswordmatch){
  return res.status(400).json({
    success: false,
    message:"password does not match"
     
  });
}

//create user token(accesstoken)
const accesstoken = jwt.sign({
  userId : user._id,
  username : user.username,
  role: user.role
}, process.env.JWT_SECRET_KEY,{
  expiresIn : '30m'
})

res.status(200).json({
  success: true,
  message: "Logged in successfully",
   accesstoken
});


  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};


//changed password controller

const changedPassword = async(req, res)=>{

  try{
const userId= req.userInfo.userId;

//extract ols and new password
const {oldPassword, newPassword}=req.body;

//find the current loggedin user
const user= await User.findById(userId);

if(!user){
   return res.status(400).json({
    success: false,
    message:"User not found"
     
  });
  }

//check if the old password is correct
const ispasswordmatch= await bcrypt.compare(oldPassword,user.password);


if(!ispasswordmatch){
  return res.status(400).json({
    success: false,
    message:"old password is bnot correct,please try again"
     
  });
}

  //hashed the new  password
  const salt = await bcrypt.genSalt(10);
  const newHashedPassword = await bcrypt.hash(newPassword, salt);

//update user password
user.password = newHashedPassword;
await user.save();

return  res.status(200).json({
  success: true,
  message: "Password is changed successfully",
});

}
  catch(e){
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}


module.exports = {
  registerUser,
  loginUser,
  changedPassword
};
