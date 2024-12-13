import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { AuthLayout } from '../../components/layouts/AuthLayout';
import { useAuthStore } from '../../components/store/authStore';
import { VerificationData } from '../../components/types/auth';
import { API_Url } from '../../components/types/authAPI';

interface LocationState {
  email: string;
  name: string;
  password: string;
  phone: string;
}

const verifyTokenSchema = z.object({
  verificationToken: z
    .string()
    .length(6, 'Verification token must be 6 digits')
    .regex(/^\d+$/, 'Verification token must contain only numbers'),
});

type VerifyTokenForm = z.infer<typeof verifyTokenSchema>;

const VerifyRegister: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.setAuth);
  const state = location.state as LocationState | undefined;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, touchedFields },
  } = useForm<VerifyTokenForm>({
    resolver: zodResolver(verifyTokenSchema),
    mode: 'onChange',
  });

  const onSubmit = async (data: VerifyTokenForm) => {
    try {
      if (!state?.email) {
        toast.error('Correo no encontrado');
        navigate('/register');
        return;
      }

      const verificationData: VerificationData = {
        token: data.verificationToken,
        user: {
          name: state.name,
          email: state.email,
          password: state.password,
          phone: state.phone,
        },
      };

      const response = await fetch(`${API_Url}/auth/verifyRegister`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(verificationData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'La verificacion ha fallado');
      }

      const { user, token } = await response.json();

      setAuth(user, token, false);
      toast.success('Cuenta creada satisfactoriamente!');
      navigate('/home');
    } catch (error) {
      console.log(error);
      const message = error instanceof Error ? error.message : 'La verificacion ha fallado. Por favor intenta nuevamente';
      toast.error(message);
    }
  };

  return (
    <AuthLayout title="Verifica tu correo electrónico">
      <form onSubmit={handleSubmit(onSubmit)} noValidate className="compact-form">
        <div className="row g-2">
          <div className="col-12">
            <div className="text-center mb-3">
              <p className="mb-1">Hemos enviado un correo electrónico a</p>
              <p className="fw-bold mb-0">{state && state.email}</p>
            </div>
          </div>

          <div className="col-12">
            <label htmlFor="verificationToken" className="form-label">
              Código de Verificación <span className="text-danger">*</span>
            </label>
            <input
              id="verificationToken"
              type="text"
              maxLength={6}
              className={`form-control form-control-sm text-center ${
                touchedFields.verificationToken && errors.verificationToken ? 'is-invalid' : ''
              }`}
              {...register('verificationToken')}
              placeholder="Ingresa el código de 6 dígitos"
            />
            {touchedFields.verificationToken && errors.verificationToken && (
              <div className="invalid-feedback">{errors.verificationToken.message}</div>
            )}
            <div className="form-text text-center">
              Por favor ingresa el codigo de verificación que hemos enviado a tu correo electrónico.
            </div>
          </div>

          <div className="col-12 mt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-success w-100 btn-sm"
            >
              {isSubmitting ? 'Verificando...' : 'Verificar Correo Electrónico'}
            </button>
          </div>

          <div className="col-12 text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="btn btn-link text-decoration-none small p-0"
            >
              Regresar a la página de registro
            </button>
          </div>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyRegister;