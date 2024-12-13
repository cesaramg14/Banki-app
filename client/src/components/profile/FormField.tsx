import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  value: string;
  type?: string;
  required?: boolean;
  error?: string;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  placeholder?: string;
  disabled?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  value,
  type = 'text',
  required = false,
  error,
  pattern,
  minLength,
  maxLength,
  placeholder,
  disabled = true,
  onChange,
}) => {
  return (
    <div className="form-group">
      <label htmlFor={name} className="form-label">
        {label}
        {required && <span className="text-danger ms-1">*</span>}
      </label>
      <input
        type={type}
        id={name}
        name={name}
        className={`form-control ${error ? 'is-invalid' : ''}`}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        pattern={pattern}
        minLength={minLength}
        maxLength={maxLength}
        placeholder={placeholder}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};