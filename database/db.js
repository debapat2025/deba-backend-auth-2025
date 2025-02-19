const mongoose = require("mongoose");


const connectToDb = async()=>{
    try{
   await mongoose.connect(process.env.MONGO_URI);
   console.log("mongodb is connected successfully")
    }
    catch(error){
      console.error("mongodb connection fail",error)
      process.exit(1)
    }
}

module.exports =connectToDb;