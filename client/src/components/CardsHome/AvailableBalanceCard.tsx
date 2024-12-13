import React from 'react';
import { FaWallet } from 'react-icons/fa';

interface AvailableBalanceCardProps {
  balance: string;
}

const AvailableBalanceCard: React.FC<AvailableBalanceCardProps> = ({ balance }) => {
  return (
    <div className="balance-card">
      <div className="balance-header">
        <FaWallet size={24} />
        <h3>Balance Disponible</h3>
      </div>
      <div className="balance-amount">
        ${parseFloat(balance).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
      </div>
    </div>
  );
};

export default AvailableBalanceCard;
