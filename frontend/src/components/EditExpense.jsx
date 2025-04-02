import React, { useState } from 'react';
import Dashboard from './Dashboard';
import EditExpense from './EditExpense';

const ExpenseTracker = () => {
    const [expenses, setExpenses] = useState([
        { id: 1, description: 'Cena', amount: 50, date: '2025-01-01' },
        { id: 2, description: 'Gasolina', amount: 30, date: '2025-01-15' },
    ]);
    const [editingExpense, setEditingExpense] = useState(null);

    const handleDeleteExpense = (id) => {
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
    };

    const handleEditExpense = (expense) => {
        setEditingExpense(expense);
    };

    const handleUpdateExpense = (updatedExpense) => {
        setExpenses((prev) =>
            prev.map((expense) =>
                expense.id === updatedExpense.id ? updatedExpense : expense
            )
        );
        setEditingExpense(null); // Salir del modo edición
    };

    const handleCancelEdit = () => {
        setEditingExpense(null);
    };

    return (
        <div>
            {editingExpense ? (
                <EditExpense
                    expense={editingExpense}
                    onUpdateExpense={handleUpdateExpense}
                    onCancel={handleCancelEdit}
                />
            ) : (
                <Dashboard
                    expenses={expenses}
                    onDeleteExpense={handleDeleteExpense}
                    onEditExpense={handleEditExpense}
                />
            )}
        </div>
    );
};

export default ExpenseTracker;
