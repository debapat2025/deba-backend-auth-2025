const cloudinary = require('../config/cloudinary')

//this will recieved a file path which we upload

const uploadToCloudinary = async (filePath)=>{
    try{

        const result =  await cloudinary.uploader.upload(filePath);
        return {
            url:result.secure_url,
            publicId:result.public_id
        }
    }
    catch(error){
        console.log("error while uploading to cloudinary",error);
        throw new Error("error while uploading to cloudinary")
    }
}

module.exports={
    uploadToCloudinary
}