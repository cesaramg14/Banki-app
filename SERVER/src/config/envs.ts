import "dotenv/config";
import * as joi from "joi";

interface EnvVars {
  PORT: number;
  DATABASE_URL: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_USER: string;
  SMTP_PASSWORD: string;
  CLOUDINARY_CLOUD_NAME: string;
  CLOUDINARY_FOLDER: string;
  CLOUDINARY_API_KEY: string;
  CLOUDINARY_API_SECRET: string;
  JWT_SECRET: string;
}

// Crear esquema de validación
const envSchema = joi
  .object({
    PORT: joi.number().required(),
    DATABASE_URL: joi.string().required(),
    SMTP_HOST: joi.string().required(),
    SMTP_PORT: joi.number().required(),
    SMTP_USER: joi.string().required(),
    SMTP_PASSWORD: joi.string().required(),
    CLOUDINARY_CLOUD_NAME: joi.string().required(),
    CLOUDINARY_FOLDER: joi.string().required(),
    CLOUDINARY_API_KEY: joi.string().required(),
    CLOUDINARY_API_SECRET: joi.string().required(),
    JWT_SECRET: joi.string().required()
  })
  // Aceptar variables no solicitadas
  .unknown(true);

// Validar las variables de entonro mediante esquema
const { error, value } = envSchema.validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

const envVars: EnvVars = value;

// Exportar variables de entorno
export const envs = {
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
  SMTP_HOST: envVars.SMTP_HOST,
  SMTP_PORT: envVars.SMTP_PORT,
  SMTP_USER: envVars.SMTP_USER,
  SMTP_PASSWORD: envVars.SMTP_PASSWORD,
  CLOUDINARY_CLOUD_NAME: envVars.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_FOLDER: envVars.CLOUDINARY_FOLDER,
  CLOUDINARY_API_KEY: envVars.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: envVars.CLOUDINARY_API_SECRET,
  JWT_SECRET: envVars.JWT_SECRET
};
