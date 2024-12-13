import React from "react";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import { LoginCredentials } from "../../components/types/auth";
import { useAuthStore } from "../../components/store/authStore";
import { SEO } from "../../components/SEO/SEO";
import { API_Url } from "../../components/types/authAPI";
import logoBanki from '../../assets/logo-banki.svg'

const loginSchema = z.object({
    email: z.string().email("Correo Electrónico inválido"),
    password: z
        .string()
        .min(8, "La contraseña debe tener al menos 8 caracteres"),
    rememberMe: z.boolean().default(false),
});

const Login: React.FC = () => {
    const navigate = useNavigate();
    const setAuth = useAuthStore((state) => state.setAuth);
    const {
        register,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
        clearErrors,
    } = useForm<LoginCredentials>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            rememberMe: false,
        },
    });

    const onSubmit = async (data: LoginCredentials) => {
        try {
            clearErrors();
            const response = await fetch(`${API_Url}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const responseData = await response.json();

            if (!response.ok) {
                if (responseData.message === 'Incorrect credentials') {
                    setError('password', { 
                        type: 'manual',
                        message: 'Correo electrónico o contraseña incorrectos'
                      });
                      return;
                    }
                    throw new Error(responseData.message || 'Login failed');
            }

            const { user, token } = responseData;
            setAuth(user, token, data.rememberMe);
            toast.success("Inicio de sesión exitoso!");
            navigate("/home");
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Login failed';
            toast.error(message);
        }
    };

    return (
        <>
            <SEO
                title="LOGIN | BANKI"
                description="Bienvenido a la página de inicio de nuestro sitio web. Aquí podrás encontrar información importante."
                keywords={["inicio", "bienvenida", "sitio web"]}
                image={logoBanki}
                url="https://localhost:5173/home"
                type="website"
            />
            <AuthLayout title="Iniciar sesión">
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                            Correo Electrónico
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            {...register('email')}
                            onChange={(e) => {
                            register('email').onChange(e);
                            clearErrors('password');
                            }}
                        />
                        {errors.email && (
                            <div className="invalid-feedback">{errors.email.message}</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                            {...register('password')}
                            onChange={(e) => {
                            register('password').onChange(e);
                            clearErrors('password');
                            }}
                        />
                        {errors.password && (
                            <div className="invalid-feedback">{errors.password.message}</div>
                        )}
                    </div>

                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMe"
                            {...register("rememberMe")}
                        />
                        <label
                            className="form-check-label"
                            htmlFor="rememberMe"
                        >
                            Recordar Contraseña
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn btn-success w-100 mb-3"
                    >
                        {isSubmitting
                            ? "Iniciando sesión..."
                            : "Iniciar sesión"}
                    </button>

                    <div className="text-center">
                        ¿No tienes una cuenta? <br />
                        <Link to="/register" className="text-decoration-none">
                            Regístrate
                        </Link>
                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

export default Login;
