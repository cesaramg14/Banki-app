import { envs } from "@config/envs";
import { v2 as cloudinary } from "cloudinary";

/* Subir imagen a Cloudinary y retornar su url */
export const uploadImage = async (image: string) => {
  const result = await cloudinary.uploader.upload(image, {
    folder: envs.CLOUDINARY_FOLDER,
  });
  return result.secure_url;
};
