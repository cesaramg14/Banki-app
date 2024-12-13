import React, { useState, useEffect } from 'react';
import { API_Url } from '../../components/types/authAPI';
import { useAuthStore } from '../../components/store/authStore';
import './TransferModal.css';
import SuccessModal from '../SuccessModal/SuccessModal';

interface TransferModalProps {
    isOpen: boolean;
    onClose: () => void;
    accountNumber: string;
    onTransferComplete: () => void;
}

interface TransferData {
    fromAccountNumber: string;
    toAccountNumber: string;
    amount: number;
    description: string;
}

const TransferModal: React.FC<TransferModalProps> = ({ isOpen, onClose, accountNumber, onTransferComplete }) => {
    const [transferData, setTransferData] = useState<TransferData>({
        fromAccountNumber: accountNumber,
        toAccountNumber: '',
        amount: '' as unknown as number, 
        description: ''
    });
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { token } = useAuthStore();

    useEffect(() => {
        if (isOpen) {
            const initialTransferData = {
                fromAccountNumber: accountNumber,
                toAccountNumber: '',
                amount: 0,
                description: ''
            };
            setTransferData(initialTransferData);
            setShowConfirmation(false);
        }
    }, [isOpen, accountNumber]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = e.target.name === 'amount' ? Number(e.target.value) : e.target.value;
        setTransferData(prev => ({
            ...prev,
            [e.target.name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setShowConfirmation(true);
    };

    const handleConfirmTransfer = async () => {
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        try {
            const response = await fetch(`${API_Url}/accounts/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(transferData)
            });

            if (!response.ok) {
                throw new Error('Error en la transferencia');
            }

            setShowSuccessModal(true);
            onTransferComplete();
        } catch (error: Error | unknown) {
            alert(error instanceof Error ? error.message : 'Error al realizar la transferencia');
        } finally {
            setIsSubmitting(false);
            setShowConfirmation(false);
        }
    };

    const handleSuccessClose = () => {
        setShowSuccessModal(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {!showConfirmation ? (
                    <>
                        <h2>Nueva Transferencia</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Cuenta de Origen</label>
                                <input
                                    type="text"
                                    value={transferData.fromAccountNumber}
                                    disabled
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Cuenta de Destino</label>
                                <input
                                    type="text"
                                    name="toAccountNumber"
                                    value={transferData.toAccountNumber}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="form-group">
                                <label>Monto</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={transferData.amount || ''} 
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="form-control"
                                    placeholder="0.00"
                                    onWheel={(e) => e.currentTarget.blur()}
                                    style={{ WebkitAppearance: 'none', MozAppearance: 'textfield' }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    name="description"
                                    value={transferData.description}
                                    onChange={handleChange}
                                    required
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-buttons">
                                <button type="button" onClick={onClose} className="btn-cancel">
                                    Cancelar
                                </button>
                                <button type="submit" className="btn-transfer">
                                    Enviar Transferencia
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="confirmation-dialog">
                        <h3>¿Confirma la transferencia?</h3>
                        <p>Monto: ${transferData.amount}</p>
                        <p>Cuenta destino: {transferData.toAccountNumber}</p>
                        <div className="modal-buttons">
                            <button 
                                onClick={() => setShowConfirmation(false)} 
                                className="btn-cancel"
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </button>
                            <button 
                                onClick={handleConfirmTransfer} 
                                className="btn-confirm"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Procesando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <SuccessModal 
                isOpen={showSuccessModal} 
                onClose={handleSuccessClose}
            />
        </div>
    );
};

export default TransferModal;