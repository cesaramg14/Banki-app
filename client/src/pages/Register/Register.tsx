import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AuthLayout } from "../../components/layouts/AuthLayout";
import { RegisterCredentials } from "../../components/types/auth";
import { FaExclamationCircle } from "react-icons/fa";
import "../../App.css";
import { SEO } from "../../components/SEO/SEO";
import { API_Url } from "../../components/types/authAPI";

const registerSchema = z
    .object({
        firstName: z
            .string()
            .min(2, "Tu Nombre debe tener al menos 2 caracteres")
            .regex(
                /^[a-zA-Z\s]*$/,
                "Tu Nombre solo debe contener letras y espacios"
            ),
        lastName: z
            .string()
            .min(2, "Tu Apellido debe tener al menos 2 caracteres")
            .regex(
                /^[a-zA-Z\s]*$/,
                "Tu apellido solo debe contener letras y espacios"
            ),
        email: z
            .string()
            .min(1, "El correo electrónico es obligatorio")
            .email("Por favor ingresa un correo electrónico válido"),
        phone: z
            .string()
            .min(1, "El telefono es obligatorio")
            .min(8, "El telefono debe tener al menos 8 caracteres")
            .max(10, "El telefono no puede exceder los 10 caracteres")
            .regex(/^\d+$/, "El telefono solo debe contener números"),
        password: z
            .string()
            .min(1, "La contraseña es obligatoria")
            .min(8, "La contraseña debe tener al menos 8 caracteres")
            .regex(
                /[A-Z]/,
                "La contraseña debe contener al menos una letra mayúscula"
            )
            .regex(
                /[a-z]/,
                "La contraseña debe contener al menos una letra minúscula"
            )
            .regex(/[0-9]/, "La contraseñ debe contener al menos un número")
            .regex(
                /[@$!%*?&]/,
                "La contraseña debe contener al menos un caracter especial (@$!%*?&)"
            ),
        confirmPassword: z.string().min(1, "Por favor confirma tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

const Register: React.FC = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, touchedFields },
    } = useForm<RegisterCredentials>({
        resolver: zodResolver(registerSchema),
        mode: "onChange", // Para validar en tiempo real
    });

    const onSubmit = async (data: RegisterCredentials) => {
        try {
            const response = await fetch(`${API_Url}/auth/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.firstName + " " + data.lastName,
                    email: data.email,
                    //phone: data.phone,
                    //password: data.password,
                }),
            });

            if (!response.ok) throw new Error("El registro ha fallado");

            navigate('/verifyRegister', { 
                state: {
                  name:data.firstName + " " + data.lastName,   
                  email:data.email,
                  password:data.password,
                  phone:data.phone,
                } 
              });
        } catch (error) {
            console.error(error);
            toast.error(
                "El registro ha fallado. Por favor intenta nuevamente."
            );
        }
    };

    return (
        <>
            <SEO
                title="REGISTER | BANKI"
                description="Bienvenido a la página de inicio de nuestro sitio web. Aquí podrás encontrar información importante."
                keywords={["inicio", "bienvenida", "sitio web"]}
                image="../assets/BANKIico.png"
                url="https://localhost:5173/home"
                type="website"
            />
            <AuthLayout title="Crear Cuenta">
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    noValidate
                    className="row g-2"
                >
                    <div className="col-sm-6">
                        <label
                            htmlFor="firstName"
                            className="form-label small mb-1"
                        >
                            Nombre <span className="text-danger">*</span>
                        </label>
                        <input
                            id="firstName"
                            type="text"
                            className={`form-control form-control-sm ${
                                touchedFields.firstName && errors.firstName
                                    ? "is-invalid"
                                    : ""
                            }`}
                            {...register("firstName")}
                            placeholder="Ingresa tu Nombre"
                        />
                        {touchedFields.firstName && errors.firstName && (
                            <div className="invalid-feedback small">
                                {errors.firstName.message}
                            </div>
                        )}
                    </div>

                    <div className="col-sm-6">
                        <label
                            htmlFor="lastName"
                            className="form-label small mb-1"
                        >
                            Apellido <span className="text-danger">*</span>
                        </label>
                        <input
                            id="lastName"
                            type="text"
                            className={`form-control form-control-sm ${
                                touchedFields.lastName && errors.lastName
                                    ? "is-invalid"
                                    : ""
                            }`}
                            {...register("lastName")}
                            placeholder="Ingresa tu Apellido"
                        />
                        {touchedFields.lastName && errors.lastName && (
                            <div className="invalid-feedback small">
                                {errors.lastName.message}
                            </div>
                        )}
                    </div>

                    <div className="col-12">
                        <label htmlFor="phone" className="form-label small mb-1">
                            Número de telefono <span className="text-danger">*</span>
                        </label>
                        <input
                            id="phone"
                            type="text"
                            className={`form-control form-control-sm ${
                                touchedFields.phone && errors.phone
                                    ? "is-invalid"
                                    : ""
                            }`}
                            {...register("phone")}
                            placeholder="Ingresa el número de telefono"
                        />
                        {touchedFields.phone && errors.phone && (
                            <div className="invalid-feedback small">
                                {errors.phone.message}
                            </div>
                        )}
                    </div>

                    <div className="col-12">
                        <label
                            htmlFor="email"
                            className="form-label small mb-1"
                        >
                            Correo Electrónico{" "}
                            <span className="text-danger">*</span>
                        </label>
                        <input
                            id="email"
                            type="email"
                            className={`form-control form-control-sm ${
                                touchedFields.email && errors.email
                                    ? "is-invalid"
                                    : ""
                            }`}
                            {...register("email")}
                            placeholder="Ingresa tu correo electrónico"
                        />
                        {touchedFields.email && errors.email && (
                            <div className="invalid-feedback small">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    <div className="col-12">
                        <label
                            htmlFor="password"
                            className="form-label d-flex align-items-center gap-1"
                        >
                            Contraseña <span className="text-danger">*</span>
                            <div
                                className="position-relative d-inline-block showText"
                                style={{ cursor: "help" }}
                            >
                                <FaExclamationCircle
                                    size={14}
                                    className="text-muted"
                                />
                                <div
                                    className="position-absolute bg-dark text-white p-2 rounded shadow-sm hideText"
                                    style={{
                                        display: "none",
                                        width: "200px",
                                        fontSize: "0.75rem",
                                        bottom: "100%",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        marginBottom: "5px",
                                        zIndex: 1000,
                                    }}
                                    role="tooltip"
                                >
                                    Debe contener 8+ caracteres con mayúscula,
                                    minúscula, número y caracter especial
                                    (@$!%*?&).
                                </div>
                            </div>
                        </label>
                        <input
                            id="password"
                            type="password"
                            className={`form-control form-control-sm ${
                                touchedFields.password && errors.password
                                    ? "is-invalid"
                                    : ""
                            }`}
                            {...register("password")}
                            placeholder="Crea una nueva contraseña"
                        />
                        {touchedFields.password && errors.password && (
                            <div className="invalid-feedback small">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    <div className="col-12">
                        <label
                            htmlFor="confirmPassword"
                            className="form-label small mb-1"
                        >
                            Confirmar Contraseña{" "}
                            <span className="text-danger">*</span>
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            className={`form-control form-control-sm ${
                                touchedFields.confirmPassword &&
                                errors.confirmPassword
                                    ? "is-invalid"
                                    : ""
                            }`}
                            {...register("confirmPassword")}
                            placeholder="Confirma tu contraseña"
                        />
                        {touchedFields.confirmPassword &&
                            errors.confirmPassword && (
                                <div className="invalid-feedback small">
                                    {errors.confirmPassword.message}
                                </div>
                            )}
                    </div>
                    <div className="col-12 mt-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-success w-100 btn-sm"
                        >
                            {isSubmitting
                                ? "Creando cuenta..."
                                : "Crear cuenta"}
                        </button>
                    </div>

                    <div className="col-12 text-center mt-2">
                        ¿Ya tienes una cuenta? <br />
                        <Link
                            to="/login"
                            className="text-decoration-none small"
                        >
                            Iniciar Sesión
                        </Link>
                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

export default Register;
