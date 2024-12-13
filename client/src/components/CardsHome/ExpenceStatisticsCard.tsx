import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface Transaction {
  fromAccount: string;
  amount: string;
}

interface ExpenseStatisticsCardProps {
  transactions: Transaction[];
}

const ExpenseStatisticsCard: React.FC<ExpenseStatisticsCardProps> = ({ transactions }) => {
  const sentTransactions = transactions
    .filter(t => t.fromAccount === '1000010')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const receivedTransactions = transactions
    .filter(t => t.fromAccount !== '1000010')
    .reduce((acc, t) => acc + parseFloat(t.amount), 0);

  const data = {
    labels: ['Transferencias Enviadas', 'Transferencias Recibidas'],
    datasets: [
      {
        data: [sentTransactions, receivedTransactions],
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(75, 192, 192, 0.8)'
        ],
        borderColor: [
          'rgb(255, 99, 132)',
          'rgb(75, 192, 192)'
        ],
        borderWidth: 1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Resumen de Transferencias',
        font: {
          size: 16
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: $ ${value.toLocaleString('es-AR')}`;
          }
        }
      }
    }
  };

  return (
    <div className="statistics-card">
      <Pie data={data} options={options} />
    </div>
  );
};

export default ExpenseStatisticsCard;
