const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString()+'-'+file.originalname.replaceAll(' ', '_'));
  }
})

const fileFilter = (req, file, cb) => {
  // Reject a file
  if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
    cb(null, true);
  }else{
    cb(null, false);
  }
}

const upload = multer({
  storage, 
  limits: {
    fileSize: 1024 * 1024 * 5 // 5mb
  },
  fileFilter
});

module.exports = upload;