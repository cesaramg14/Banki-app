import { User } from './auth';

export interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  dni: string;
  phone: string;
  address: string;
  country: string;
  state: string;
  password: string;
}

export interface ProfileImageResponse {
  imageUrl: string;
}

export interface ProfileApiResponse {
  user: User;
}