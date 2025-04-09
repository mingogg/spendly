import React, { useState } from "react";
import axios from "axios";
import '../styles/styles.css';


const AddExpense = ({ onAddExpense }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState("");
    const [error, setError] = useState("");

    const today = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(today.getFullYear() - 1);
    const maxDate = today.toISOString().split("T")[0];
    const minDate = oneYearAgo.toISOString().split("T")[0];

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!description || !amount || !date) {
            alert("Todos los campos son requeridos");
            return;
        }

        try {
            const response = await axios.post('http://127.0.0.1:5000/expenses', {
                description,
                amount: Number(amount),
                date
            });

            onAddExpense(response.data);
            setDescription('');
            setAmount('');
            setDate('');
        }
        catch (error) {
            console.error('Error al agregar gasto:', error);
            setError('Hubo un error al agregar el gasto. Inténtalo de nuevo.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            {/* Div para el input de descripción */}
            <div className="form-group">
                <label htmlFor="description">¿En qué gastaste?</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            
            {/* Div para el input de monto */}
            <div className="form-group">
                <label htmlFor="amount" >Monto:</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            {/* Div para el input de fecha */}
            <div className="form-group">
                <label htmlFor="date">Fecha:</label>
                <input
                    type="date"
                    min={minDate}
                    max={maxDate}
                    id="date"
                    name="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <button className="btn btn-primary mt-0 mb-0">Agregar</button>
        </form >
        
    );
};

export default AddExpense;