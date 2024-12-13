import React from 'react';
import { FaUpload, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

interface ProfileImageProps {
  imageUrl: string | null;
  onImageChange: (file: File | null) => void;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({ imageUrl, onImageChange }) => {
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Imagen debe ser menor a 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('El archivo debe ser una imagen');
        return;
      }
      onImageChange(file);
    }
  };

  return (
    <div className="text-center mb-4">
      <div className="position-relative d-inline-block">
        <div
          className="rounded-circle overflow-hidden bg-light d-flex align-items-center justify-content-center"
          style={{ width: '150px', height: '150px' }}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Profile"
              className="w-100 h-100 object-fit-cover"
            />
          ) : (
            <div className="text-muted">
              <FaUpload size={40} />
            </div>
          )}
        </div>
        <div className="position-absolute bottom-0 end-0">
          <label
            htmlFor="profile-image"
            className="btn btn-success btn-sm rounded-circle p-2"
            style={{ cursor: 'pointer' }}
          >
            <FaUpload size={16} />
            <input
              type="file"
              id="profile-image"
              className="d-none"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          {imageUrl && (
            <button
              className="btn btn-danger btn-sm rounded-circle p-2 ms-2"
              onClick={() => onImageChange(null)}
            >
              <FaTimes size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};