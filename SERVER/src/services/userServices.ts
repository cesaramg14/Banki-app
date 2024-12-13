import { User } from "@models/User";
import { Model } from "sequelize";

interface UserAttributes {
    id: number;
    name: string;
    email: string;
    phone: string;
    password?: string; 
    img?: string;
    active: boolean;
    role: string;
}

interface UserInstance extends Model<UserAttributes>, UserAttributes {}

interface UpdateUserProfileDto {
    name?: string;
    email?: string;
    phone?: string;
    img?: string;
}

export const updateUserProfile = async (
    userId: number,
    updateData: UpdateUserProfileDto
): Promise<Omit<UserAttributes, 'password'>> => {
    const user = await User.findByPk(userId) as UserInstance;
    if (!user) {
        throw new Error("User not found");
    }

    const updatedUser = await user.update({
        name: updateData.name || user.get('name'),
        email: updateData.email || user.get('email'),
        phone: updateData.phone || user.get('phone'),
        img: updateData.img || user.get('img'),
    });

    const userJson = updatedUser.toJSON();
    delete userJson.password;
    return userJson;
};

//Delete a user logically
export const deleteUserService = async (
    userId: number
): Promise<Omit<UserAttributes, 'password'>> => {
    const user = await User.findByPk(userId) as UserInstance;
    if (!user) {
        throw new Error("User not found");
    }

    const updatedUser = await user.update({
        active: false, 
    });

    const userJson = updatedUser.toJSON();
    delete userJson.password; 
    return userJson;
};