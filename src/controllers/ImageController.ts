import { Response } from "express";
import { AuthRequest } from "../ts/interfaces/app-interfaces";
import path from "path";
import * as fs from "fs";
import crypto from "crypto";
import dotenv from "dotenv";
import { loadAndDecryptImage } from "../utils/encryption";

// Load environment variables from the .env file
dotenv.config();

const getImage = async (request: AuthRequest, response: Response) => {
  const { image } = request.params;
  const encryptedImageName = image + ".enc";
  const encryptedImagePath = path.join(
    __dirname,
    "../protected/images/",
    encryptedImageName
  );

  console.log(encryptedImagePath);

  try {
    // Check if the encrypted file exists
    if (fs.existsSync(encryptedImagePath)) {
      // Decrypt the file
      const image = loadAndDecryptImage(encryptedImagePath);

      if (!image) {
        return response
          .status(500)
          .json({ message: "Ocurrio un error desencriptando la imagen" });
      }

      // Determine the content type based on the image file extension
      const extension = image.split(".").pop();
      let contentType = "image/jpeg"; // Default content type to JPEG

      if (extension) {
        switch (extension.toLowerCase()) {
          case "jpg":
          case "jpeg":
            contentType = "image/jpeg";
            break;
          case "png":
            contentType = "image/png";
            break;
          // Add more cases for other image formats as needed
        }
      }

      // Set the response content type based on the image's file extension
      response.setHeader("Content-Type", contentType);

      // Send the decrypted image data as the response
      response.status(200).send(Buffer.from(image, "base64"));
    } else {
      response.status(404).json({ message: "Image not found" });
    }
  } catch (error) {
    console.log(error);
    response.status(500).json({ message: error });
  }
};

export default { getImage };
