interface TransactionsTableProps {
    transactions: {
        id: number;
        description: string;
        amount: string;
        isDebit: boolean;
    }[];
}

const TransactionsTable: React.FC<TransactionsTableProps> = ({ transactions }) => {
    return (
        <div className="transactions-section">
            <div className="transactions-table-container">
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>Descripción</th>
                            <th>Monto</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.description}</td>
                                <td className={transaction.isDebit ? 'debit' : 'credit'}>
                                    {transaction.isDebit ? '-' : '+'}${transaction.amount}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TransactionsTable; 