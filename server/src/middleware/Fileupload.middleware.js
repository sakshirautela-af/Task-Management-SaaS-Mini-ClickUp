import multer from "multer";
import path from "path";
const uploadpath = path.resolve(import.meta.dirname, "../../uploads");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadpath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const fileName = Date.now() + extension;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  cb(null, true);
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
export default upload;
