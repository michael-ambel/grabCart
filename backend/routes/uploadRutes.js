import path from "path"; // Import path module for handling file paths
import express from "express"; // Import Express framework
import multer from "multer"; // Import Multer for file handling

const router = express.Router(); // Create a new router

// Configure Multer with file type check and storage in one `upload` constant
const upload = multer({
  // File type validation with fileFilter (runs first)
  fileFilter(req, file, cb) {
    const allowedTypes = /jpg|jpeg|png/; // Allowed file types
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    ); // Check file extension
    const mimetype = allowedTypes.test(file.mimetype); // Check MIME type

    if (extname && mimetype) {
      cb(null, true); // Accept the file if both checks pass
    } else {
      cb(new Error("Only image files (jpg, jpeg, png) are allowed!")); // Reject the file otherwise
    }
  },

  // Storage configuration (only processed if file passes fileFilter)
  storage: multer.diskStorage({
    destination(req, file, cb) {
      cb(null, "uploads/"); // Set upload directory to 'uploads/'
    },
    filename(req, file, cb) {
      const uniqueName = `${file.fieldname}-${Date.now()}${path.extname(
        file.originalname
      )}`;
      cb(null, uniqueName); // Set a unique filename with original extension
    },
  }),
});

// Route to handle single image upload
router.post("/", upload.single("image"), (req, res) => {
  res.send({
    message: "Image uploaded", // Success message
    image: `/${req.file.path}`, // File path of the uploaded image
  });
});

export default router; // Export the router
