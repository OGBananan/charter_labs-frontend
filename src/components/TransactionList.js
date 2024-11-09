import React from "react";

const TransactionList = ({ transactions }) => {
    return (
        <div>
            <h2>Recent Transactions</h2>
            {transactions.map((transaction) => (
                <div key={transaction.id} className="transaction">
                    <p><strong>From:</strong> {transaction.from_address}</p>
                    <p><strong>To:</strong> {transaction.to_address}</p>
                    <p><strong>Value:</strong> {transaction.value} USDC</p>
                    <p><strong>Timestamp:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
                </div>
            ))}
        </div>
    );
};

export default TransactionList;
