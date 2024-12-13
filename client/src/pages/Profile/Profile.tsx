import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { ProfileImage } from '../../components/profile/ProfileImage';
import { ProfileForm } from '../../components/profile/ProfileForm';
import { useAuthStore } from '../../components/store/authStore';
import type { ProfileFormData } from '../../components/types/profile';
import BackgroundComponent from '../../components/BackgroundComponent';
import '../../pages/Profile/Profile.css';
import { API_Url } from '../../components/types/authAPI';

interface User {
    id: number;
    name: string;
    email: string;
    phone: string;
    img: string | null;
    active: boolean;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { updateUser, user, token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    password: '',
  });
  const [originalData, setOriginalData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    dni: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    password: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/profile', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar el perfil');
        }

        const data = await response.json();
        const profileData = {
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          email: data.user.email,
          dni: data.user.dni,
          phone: data.user.phone || '',
          address: data.user.address || '',
          country: data.user.country || '',
          state: data.user.state || '',
          password: '',
        };
        setFormData(profileData);
        setOriginalData(profileData);
        setImageUrl(data.user.profileImage);
      } catch (error) {
        console.log(error);
        toast.error('Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = useCallback((name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleDiscard = () => {
    setFormData(originalData);
    setErrors({});
    setIsEditing(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || sessionStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
          return;
        }
        throw new Error(errorData.message || 'Error al actualizar el perfil');
      }

      const { user: updatedUser } = await response.json();
      updateUser(updatedUser);
      setOriginalData(formData);
      setIsEditing(false);
      toast.success('Perfil actualizado correctamente');
    } catch (error) {
      console.log(error);
      toast.error('Error al actualizar el perfil');
    }
  };

  const handleImageChange = async (file: File | null) => {
    if (file) {
        try {
            // Primero obtenemos todos los usuarios
            const usersResponse = await fetch(`${API_Url}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!usersResponse.ok) {
                throw new Error('Error al obtener usuarios');
            }

            const users = await usersResponse.json();
            // Encontrar el usuario actual
            const currentUser = users.find((u: User) => u.id === user?.id);

            if (!currentUser) {
                throw new Error('Usuario no encontrado');
            }

            // Ahora actualizamos la imagen
            const formData = new FormData();
            formData.append('img', file);

            const updateResponse = await fetch(`${API_Url}/users`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });

            if (!updateResponse.ok) {
                throw new Error('Error al actualizar la imagen');
            }

            const updatedData = await updateResponse.json();
            setImageUrl(updatedData.img);
            toast.success('Imagen actualizada con éxito');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al actualizar la imagen');
        }
    } else {
        try {
            // Similar proceso para eliminar la imagen
            const usersResponse = await fetch(`${API_Url}/users`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!usersResponse.ok) {
                throw new Error('Error al obtener usuarios');
            }

            const users = await usersResponse.json();
            const currentUser = users.find((u: User) => u.id === user?.id);

            if (!currentUser) {
                throw new Error('Usuario no encontrado');
            }

            const updateResponse = await fetch(`${API_Url}/users`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ img: null })
            });

            if (!updateResponse.ok) {
                throw new Error('Error al eliminar la imagen');
            }

            setImageUrl(null);
            toast.success('Imagen eliminada con éxito');
        } catch (error) {
            console.error('Error:', error);
            toast.error('Error al eliminar la imagen');
        }
    }
  };

  if (loading) {
    return (
      <div className="profile-container">
        <div className="text-center w-100">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <BackgroundComponent>
      <div className="profile-container">
        <div className="container h-100">
          <div className="row h-100 justify-content-center">
            <div className="col-12 col-lg-8 h-100">
              <div className="card shadow-sm profile-card">
                <div className="card-body d-flex flex-column">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <button
                      type="button"
                      className="btn btn-link text-decoration-none p-0"
                      onClick={() => navigate(-1)}
                    >
                      <FaArrowLeft size={20} className="me-2" />
                      Atrás
                    </button>
                    <h2 className="card-title m-0">Perfil de Usuario</h2>
                  </div>
                  
                  <ProfileImage
                    imageUrl={imageUrl}
                    onImageChange={handleImageChange}
                  />

                  <ProfileForm
                    data={formData}
                    errors={errors}
                    isEditing={isEditing}
                    onChange={handleChange}
                    onEdit={handleEdit}
                    onSave={handleSubmit}
                    onDiscard={handleDiscard}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BackgroundComponent>
  );
};