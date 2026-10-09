const multer = require("multer");
require('dotenv').config(); // Load environment variables from .env file
const cloudinary = require('../Config/cloudinary'); //import the cloudinary configuration
const { CloudinaryStorage } = require("multer-storage-cloudinary");

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "products",
        allowed_formats: ["jpg", "jpeg", "png"]
    }
});

const upload = multer({ storage });

module.exports = upload;