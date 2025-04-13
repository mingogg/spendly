import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import 'bootstrap/dist/css/bootstrap.min.css';


const App = () => {
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/expenses');
      setExpenses(response.data);
    }
    catch (error) {
      console.error('Error fetching expenses:', error);
    }
  };

  const handleEditExpense = (id) => {
    setEditingExpense(id);
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
      setEditingExpense(null);
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
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      } catch (error) {
        console.error("There's been an error deleting the expense:", error)
      }
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  return (
    <div>
      <Header />
      <main>
            <AddExpense onAddExpense={fetchExpenses} />
            
            <Dashboard
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
            onUpdateExpense={handleUpdateExpense} />
      </main>
    </div>
  );
};

export default App;
