import React from 'react';
import BackgroundComponent from '../BackgroundComponent';
import '../../App.css';
import logoBanki from '../../assets/logo-banki.svg'

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title }) => {
  return (
    <BackgroundComponent>
    <div className="min-vh-100 d-flex align-items-center justify-content-center py-2">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-6 col-xl-5">
            <div className="text-center mb-2">
              <div style={{ width: '250px', height: '80px' }} className="mx-auto mb-2">
                <img
                  src={logoBanki}
                  alt="Logo"
                  className="img-fluid"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </div>
            </div>
            <div className="card shadow-sm">
              <h2 className="mt-1 fw-bold h4 text-center">{title}</h2>
              <div className="card-body p-3">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </BackgroundComponent>
  );
};