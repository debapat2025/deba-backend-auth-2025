const express = require("express");


const router = express.Router();

const authMiddleware = require("../middleware/auth-middleware");
const adminMiddleware = require("../middleware/admin-middleware");
const uploadMiddleware = require("../middleware/upload-middleware");
const {uploadImageController} = require("../controllers/image-controller");
const {fetchImagecontroller} = require("../controllers/image-controller");

const {deleteImagecontroller}= require("../controllers/image-controller");

//upload the image

router.post('/upload',authMiddleware,adminMiddleware,uploadMiddleware.single("image"),uploadImageController)


//get all the images
router.get('/get',authMiddleware,fetchImagecontroller)

//67b303ccc8ec2904cec56118
//delete image route
router.delete('/:id',authMiddleware,adminMiddleware,deleteImagecontroller)




module.exports= router;