const mongoose = require("mongoose");

//mongooes schema
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      // required : [true, 'User name is required'],
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"], //only alow user or admin roles
      default: "user"
    }
    
  },
  { timestamps: true }
);


module.exports=mongoose.model('User',UserSchema)