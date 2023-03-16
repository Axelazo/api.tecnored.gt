import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";

const DIR = path.join(__dirname, "../public/");

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, DIR);
  },
  filename: (request, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

const upload = multer({
  storage,
  fileFilter: (request, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error("Solo se aceptan formatos .png, .jpg and .jpeg!"));
    }
  },
});

export default upload;
