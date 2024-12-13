import React from 'react';
import './SuccessModal.css';

interface SuccessModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="success-modal-overlay">
            <div className="success-modal">
                <h2>¡Transferencia Exitosa!</h2>
                <p>La transferencia se ha realizado correctamente.</p>
                <button className="success-button" onClick={onClose}>
                    Aceptar
                </button>
            </div>
        </div>
    );
};

export default SuccessModal; 