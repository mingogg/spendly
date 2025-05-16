import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import BalanceSummary from './components/BalanceSummary';
import Login from './components/Login';
import { calculateBalance } from './utils/calculateUtils';

const App = () => {
    const [username, setUsername] = useState(localStorage.getItem('username'));

    const [expenses, setExpenses] = useState([]);
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [categories, setCategories] = useState(null);

    const { balanceIncome, balanceExpense, balanceTotal } =
        calculateBalance(expenses);

    const [token, setToken] = useState(localStorage.getItem('token'));

    const fetchExpenses = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:5000/api/expenses',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setExpenses(response.data);
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                'http://127.0.0.1:5000/api/categories',
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        if (token) {
            fetchExpenses();
            fetchCategories();
        }
    }, [token]);

    if (!token) {
        return (
            <Login
                onLoginSuccess={(data) => {
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('username', data.username);
                    setToken(data.token);
                    setUsername(data.username);
                }}
            />
        );
    }

    const handleEditExpense = (id) => {
        setEditingExpenseId(id);
    };

    const handleUpdateExpense = async (updatedExpense) => {
        let formattedDate = '';

        try {
            formattedDate = new Date(updatedExpense.date)
                .toISOString()
                .split('T')[0];
        } catch (error) {
            alert('Invalid date. Please try again.');
            return;
        }

        const expenseToSend = {
            ...updatedExpense,
            date: formattedDate,
            amount: parseInt(updatedExpense.amount, 10),
        };

        try {
            await axios.put(
                `http://127.0.0.1:5000/api/expenses/${updatedExpense.id}`,
                expenseToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );
            await fetchExpenses();
            setEditingExpenseId(null);
        } catch (error) {
            console.error('Error updating expense:', error);
            alert("There's been an error updating the expense.");
        }
    };

    const handleAddExpense = (newExpense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    };

    const handleDeleteExpense = async (id) => {
        if (window.confirm('¿Delete expense?')) {
            try {
                await axios.delete(`http://127.0.0.1:5000/api/expenses/${id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                });
                setExpenses((prevExpenses) =>
                    prevExpenses.filter((expense) => expense.id !== id)
                );
            } catch (error) {
                console.error(
                    "There's been an error deleting the expense:",
                    error
                );
            }
        }
    };

    return (
        <div>
            <Sidebar
                username={username}
                onLogout={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    setToken(null);
                    setUsername(null); // limpiamos también el estado
                }}
            />

            <main className="main-content">
                <h2>Expense tracking</h2>
                <div className="balance-form">
                    <BalanceSummary
                        balanceIncome={balanceIncome}
                        balanceExpense={balanceExpense}
                        balanceTotal={balanceTotal}
                    />

                    <AddExpense
                        onAddExpense={fetchExpenses}
                        categories={categories}
                        setCategories={setCategories}
                        fetchCategories={fetchCategories}
                    />
                </div>
                <Dashboard
                    expenses={expenses}
                    categories={categories}
                    onDeleteExpense={handleDeleteExpense}
                    onEditExpense={handleEditExpense}
                    onUpdateExpense={handleUpdateExpense}
                />
            </main>
        </div>
    );
};

export default App;
