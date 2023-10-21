import { v4 as uuidv4 } from "uuid";
import multer from "multer";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { Request, Response } from "express"; // Import the appropriate request and response types
import { encryptImageAndSave } from "../utils/encryption";

dotenv.config();

const DIR = path.join(__dirname, "../protected/images/");

const storage = multer.diskStorage({
  destination: (request, file, cb) => {
    cb(null, DIR);
  },
  filename: (request, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4() + "-" + fileName);
  },
});

/* const encryptFile = (
  inputFile: string,
  outputFile: string,
  callback: (error: Error | null) => void
) => {
  /*   const key = crypto.scryptSync(encryptionKey, "salt", 32);
  const iv = crypto.randomBytes(parseInt(ivLength)); 

  const key = crypto.scryptSync("123", "salt", 32);
  const iv = crypto.randomBytes(16);

  const cipher = crypto.createCipheriv("aes-256-ctr", key, iv);

  const input = fs.createReadStream(inputFile);
  const output = fs.createWriteStream(outputFile);

  input.pipe(cipher).pipe(output);

  output.on("finish", () => {
    console.log("Encryption succesfull!");
    callback(null); // Encryption completed successfully
  });

  output.on("error", (error) => {
    console.error("Encryption error:", error);
    callback(error);
  });
};
 */
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

const uploadMiddleware = (
  request: Request,
  response: Response,
  next: (err?: any) => void
) => {
  if (request.files) {
    let files: Express.Multer.File[] = [];

    if (Array.isArray(request.files)) {
      // If request.files is already an array, use it as is
      files = request.files;
    } else if (typeof request.files === "object") {
      // If request.files is an object, assume it's a fieldname-to-files mapping
      Object.values(request.files).forEach((fieldFiles) => {
        if (Array.isArray(fieldFiles)) {
          files = files.concat(fieldFiles);
        }
      });
    }

    // Now you have an array of Express.Multer.File objects
    // You can iterate through it and process the files
    files.forEach((file) => {
      const uploadedFilePath = path.join(DIR, file.filename);
      const encryptedFilePath = path.join(DIR, file.filename + ".enc");
      /* 
      encryptFile(uploadedFilePath, encryptedFilePath, (error) => {
        if (error) {
          console.error(
            "[server]: ⚡️ TecnoRedMS API - Error encrypting the file:",
            error
          );
          throw error; // Throw the error to cancel the request
        } else {
          // File successfully encrypted, you can now handle it further if needed

          // Delete the original file after successful encryption
          fs.unlink(uploadedFilePath, (unlinkError) => {
            if (unlinkError) {
              console.error(
                "[server]: ⚡️ TecnoRedMS API - Error deleting the original file:",
                unlinkError
              );
              throw unlinkError; // Throw the error to cancel the request
            } else {
              console.log(
                "[server]: ⚡️ TecnoRedMS API - File successfully encrypted and original deleted."
              );
            }
          });
        }
      }); */

      const imageBuffer = fs.readFileSync(uploadedFilePath);

      encryptImageAndSave(imageBuffer, encryptedFilePath);
    });
    // Continue to the next middleware
    next();
  }
};

export default { upload, uploadMiddleware };
