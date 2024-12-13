import React, { useEffect } from 'react';
import { FormField } from './FormField';
import type { ProfileFormData } from '../types/profile';
import { useAuthStore } from '../store/authStore';

interface ProfileFormProps {
  data: ProfileFormData;
  errors: Record<string, string>;
  isEditing: boolean;
  onChange: (name: string, value: string) => void;
  onEdit: () => void;
  onSave: (e: React.FormEvent) => void;
  onDiscard: () => void;
}

export const ProfileForm: React.FC<ProfileFormProps> = ({
  data,
  errors,
  isEditing,
  onChange,
  onEdit,
  onSave,
  onDiscard,
}) => {
  const { user } = useAuthStore();
  
  useEffect(() => {
    if (user && !data.firstName && !data.lastName) {
      const [firstName, lastName] = user.name.split(' ');
      onChange('firstName', firstName || '');
      onChange('lastName', lastName || '');
      onChange('email', user.email);
    }
  }, [user, data.firstName, data.lastName, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.name, e.target.value);
  };

  return (
    <form onSubmit={onSave} className="profile-form">
      <div className="profile-form-fields">
        <div className="row g-2">
          <div className="col-md-6">
            <FormField
              label="Primer Nombre"
              name="firstName"
              value={data.firstName}
              required
              error={errors.firstName}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <FormField
              label="Apellido"
              name="lastName"
              value={data.lastName}
              required
              error={errors.lastName}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row g-2">
          <div className="col-12">
            <FormField
              label="Número de teléfono"
              name="phone"
              type="tel"
              value={data.phone || ''}
              error={errors.phone}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div className="row g-2">
          <div className="col-md-6">
            <FormField
              label="Email"
              name="email"
              type="email"
              value={data.email}
              required
              error={errors.email}
              disabled={!isEditing}
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <FormField
              label="Contraseña"
              name="password"
              type="password"
              value={data.password || ''}
              error={errors.password}
              disabled={!isEditing}
              onChange={handleInputChange}
              placeholder={isEditing ? "Ingresa nueva contraseña" : "••••••••"}
            />
          </div>
        </div>
      </div>

      <div className="profile-form-buttons">
        {!isEditing ? (
          <button
            type="button"
            className="btn btn-success btn-sm"
            onClick={onEdit}
          >
            Editar datos
          </button>
        ) : (
          <>
            <button
              type="button"
              className="btn btn-outline-secondary btn-sm"
              onClick={onDiscard}
            >
              Descartar Cambios
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-sm"
            >
              Guardar Cambios
            </button>
          </>
        )}
      </div>
    </form>
  );
};