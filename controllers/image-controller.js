const { uploadToCloudinary } = require("../helpers/cloudinaryHelper");
const Image = require("../models/Image");
const fs = require("fs");
const cloudinary = require('../config/cloudinary')

const uploadImageController = async(req,res) =>{
try{

//check if file is missing in req object
if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "File is required. Please upload an image",
    });
  }


  //upload to cloudinary
  const { url, publicId } = await uploadToCloudinary(req.file.path);

  //store the image url and public id along with the uploaded user id in database
  const newlyUploadedImage = new Image({
    url,
    publicId,
    uploadedBy: req.userInfo.userId,
  });

  await newlyUploadedImage.save()

   //delete the file from local stroage
     //fs.unlinkSync(req.file.path);

  res.status(201).json({
    success: true,
    message: "Imaged uploaded successfully",
    image: newlyUploadedImage,
  });

}
catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}


const fetchImagecontroller = async(req,res)=>{
  try{
//pagination  start
const page =parseInt(req.query.page) || 1; //page
const limit = parseInt(req.query.limit) || 2; //perpage
const skip =(page-1)* limit;

//sorting
const sortBy= req.query.sortBy || 'createdAt';
const sortOrder= req.query.sortOrder==='asc'? 1 : -1;
const totalImages = await Image.countDocuments();
const totalPages= Math.ceil(totalImages/limit);

const sortObj ={};
sortObj[sortBy]=sortOrder;

//pagination and sorting end

//find all image with out pagination and sorting
//const images = await Image.find({});

//find image with pagination and sorting
const images = await Image.find().sort(sortObj).skip(skip).limit(limit);

if(images){
  res.status(200).json({
    success: true,
    currentPage: page,
    totalPages:totalPages,
    totalImages:totalImages,
    message: "Images fetched successfully",
    data: images
    

  });
}
  }
  catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}



const deleteImagecontroller = async(req,res)=>{
  try{

const getCurrentIdofImageTobeDeleted =req.params.id;
const userId= req.userInfo.userId;

const image =await Image.findById(getCurrentIdofImageTobeDeleted);

if(!image){
  return res.status(400).json({
    success: false,
    message:"Image Not found"
     
  });
}

//check if this image is uploaded by user or not who is trying to delete this image
if(image.uploadedBy.toString() !== userId){
  return res.status(403).json({
    success: false,
    message:"you are not authorized to delete the image because you hav not uploaded it"
     
  });
}

//delete this image from cloudinary storage first

await cloudinary.uploader.destroy(image.publicId);

//delete this image from mongodb database
 await Image.findByIdAndDelete(getCurrentIdofImageTobeDeleted);

 res.status(200).json({
  success: true,
  message: "Image is deleted successfully",
});


  }
  catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
}


module.exports = {
  uploadImageController,
  fetchImagecontroller,
  deleteImagecontroller
}