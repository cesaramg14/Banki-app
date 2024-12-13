import React from 'react';

interface Transaction {
  id: number;
  amount: string;
  type: string;
  status: string;
  description: string;
  fromAccount: string;
  toAccount: string;
  date: string;
  isDebit: boolean;
}

interface TransactionsTableProps {
  transactions: Transaction[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="transactions-table">
      <table>
        <thead>
          <tr>
            <th>Tipo</th>
            <th>Descripción</th>
            <th>Cuenta Origen</th>
            <th>Cuenta Destino</th>
            <th>Monto</th>
            <th>Estado</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>{transaction.type}</td>
              <td>{transaction.description}</td>
              <td>{transaction.fromAccount}</td>
              <td>{transaction.toAccount}</td>
              <td className={transaction.isDebit ? 'amount-negative' : 'amount-positive'}>
                ${parseFloat(transaction.amount).toLocaleString('es-AR', { minimumFractionDigits: 2 })}
              </td>
              <td>
                <span className={`status ${transaction.status.toLowerCase()}`}>
                  {transaction.status}
                </span>
              </td>
              <td>{formatDate(transaction.date)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionsTable;

