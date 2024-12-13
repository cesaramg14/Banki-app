import { catchError } from "@middlewares/catchError";
import { User } from "@models/User";

import { updateUserProfile, deleteUserService} from "@services/userServices";

export const getAll = catchError(async (req, res) => {
  const users = await User.findAll();
  return res.json(users);
});
export const updateProfile = catchError(async (req, res) => {
  const userId = req.params.id;
  const updateData = req.body;
  
  const updatedUser = await updateUserProfile(Number(userId), updateData);
  return res.json(updatedUser);
});

export const deleteUser = catchError(async (req, res) => {
  const userId = req.params.id;
  const deleteUser = await deleteUserService(Number(userId));
  return res.json(deleteUser);
});