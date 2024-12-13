export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    img: string | null;
}
  
  export interface LoginCredentials {
    email: string;
    password: string;
    rememberMe: boolean;
  }
  
  export interface RegisterCredentials {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
    confirmPassword: string;
  }

  export interface VerificationData {
    token: string;
    user: {
      name: string;
      email: string;
      password: string;
      phone: string;
    };
  }