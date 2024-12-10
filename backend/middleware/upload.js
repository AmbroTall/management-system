const multer = require('multer');
const path = require('path');

// Multer storage configuration
const storage = multer.diskStorage({
  // Directory to save profile pictures
  destination: (req, file, cb) => {
    cb(null, 'uploads/profile_pics');  
  },
  filename: (req, file, cb) => {
    // File name with timestamp
    cb(null, Date.now() + path.extname(file.originalname));  
  },
});

// File filter to accept only image files
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, PNG, and GIF files are allowed.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },  // Limit file size to 5MB
});

module.exports = upload;
