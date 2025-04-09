import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AddExpense from './components/AddExpense';
import EditExpense from './components/EditExpenseForm';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

const App = () => {
  {/* useState es un hook que permite modificar una variable dentro del DOM */}
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpense] = useState(null);

  const fetchExpenses = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/expenses');
      console.log("Datos recibidos del backend:", response);
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
    } catch (err) {
      alert("La fecha es inválida. Por favor seleccioná una correcta.");
      return;
    }
  
    const expenseToSend = {
      ...updatedExpense,
      date: formattedDate,
      amount: parseInt(updatedExpense.amount, 10),
    };
  
    try {
      console.log("Datos enviados al backend:", expenseToSend);
      await axios.put(`http://127.0.0.1:5000/expenses/${updatedExpense.id}`, expenseToSend);
      await fetchExpenses(); // 🔁 Recarga los datos del backend
      setEditingExpense(null); // ✅ Cierra el formulario de edición
    } catch (error) {
      console.error("Error updating expense:", error);
      alert("Hubo un error al actualizar el gasto.");
    }
  };
  

  const handleAddExpense = (newExpense) => {
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  {/* async hace que la función sea asíncrona, lo que significa que se ejecutará en segundo plano y no bloqueará la ejecución del resto del código */}
  {/* por ejemplo: si se está esperando una respuesta del servidor, el resto del código puede seguir ejecutándose mientras se espera la respuesta */}
  {/* await es una palabra clave que se usa para esperar a que una promesa se resuelva, en este caso, se está esperando a que la petición a la API se complete */}
  const handleDeleteExpense = async (id) => {
    if (window.confirm("¿Eliminar gasto?")) {
      try {
        await axios.delete(`http://127.0.0.1:5000/expenses/${id}`);
        setExpenses((prevExpenses) => prevExpenses.filter((expense) => expense.id !== id));
      } catch (error) {
        console.error('Error eliminando el gasto:', error)
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
        {editingExpenseId ? (
          <EditExpense
            expense={expenses.find((expense) => expense.id === editingExpenseId)}
            onUpdateExpense={handleUpdateExpense}
            onCancel={() => setEditingExpense(null)}
          />
        ) : (
          <>
            <AddExpense onAddExpense={fetchExpenses} />
            <Dashboard
            expenses={expenses}
            onDeleteExpense={handleDeleteExpense}
            onEditExpense={handleEditExpense}
            onUpdateExpense={handleUpdateExpense}
/>

          </>
        )}
      </main>
    </div>
  );
};

export default App;