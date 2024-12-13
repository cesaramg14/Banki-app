import bcrypt from "bcrypt";

/* Hashser contraseña del usuario para guardar en base de datos */
export const hashPassword = (password: string) => {
  const salt = 10;
  const hashedPassword = bcrypt.hashSync(password, salt);
  return hashedPassword;
};
