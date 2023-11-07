const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  // cloud_name: process.env.CLOUDINARY_NAME,
  // api_key: process.env.CLOUDINARY_KEY,
  // api_secret: process.env.CLOUDINARY_SECRET

  cloud_name: "dj9kuswbx",
  api_key: "548246372518537",
  api_secret: "v_10snJfdD1VfjRAgtIpe0dBm8k",
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  params: {
    folder: "xioami",
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
