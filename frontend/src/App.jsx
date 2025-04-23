import React, { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import AddExpense from "./components/AddExpense";
import BalanceSummary from "./components/BalanceSummary";
import { calculateBalance } from './utils/calculateUtils';
import "bootstrap/dist/css/bootstrap.min.css";

const App = () => {
    const [expenses, setExpenses] = useState([]);
    const [editingExpenseId, setEditingExpenseId] = useState(null);
    const [categories, setCategories] = useState(null)

    const { balanceIncome, balanceExpense, balanceTotal } = calculateBalance(expenses);


    const fetchExpenses = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/expenses");
            setExpenses(response.data);
        } catch (error) {
            console.error("Error fetching expenses:", error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get("http://127.0.0.1:5000/categories");
            setCategories(response.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleEditExpense = (id) => {
        setEditingExpenseId(id);
    };

    const handleUpdateExpense = async (updatedExpense) => {
        let formattedDate = "";

        try {
            formattedDate = new Date(updatedExpense.date).toISOString().split("T")[0];
        } catch (error) {
            alert("Invalid date. Please try again.");
            return;
        }

        const expenseToSend = {
            ...updatedExpense,
            date: formattedDate,
            amount: parseInt(updatedExpense.amount, 10),
        };

        try {
            await axios.put(`http://127.0.0.1:5000/expenses/${updatedExpense.id}`, expenseToSend);
            await fetchExpenses();
            setEditingExpenseId(null);
        } catch (error) {
            console.error("Error updating expense:", error);
            alert("There's been an error updating the expense.");
        }
    };

    const handleAddExpense = (newExpense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    };

    const handleDeleteExpense = async (id) => {
        if (window.confirm("¿Delete expense?")) {
            try {
                await axios.delete(`http://127.0.0.1:5000/expenses/${id}`);
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

    useEffect(() => {
        fetchExpenses();
        fetchCategories();
    }, []);

    return (
        <div>
            <Sidebar />
            <main className="main-content">
                <h2>Expense tracking</h2>
                <BalanceSummary
                    balanceIncome={balanceIncome}
                    balanceExpense={balanceExpense}
                    balanceTotal={balanceTotal}
                />
                <AddExpense
                    onAddExpense={fetchExpenses}
                    categories={categories} />
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
