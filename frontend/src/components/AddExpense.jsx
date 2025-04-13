import React, { useState } from "react";
import axios from "axios";
import '../styles/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';



const AddExpense = ({ onAddExpense }) => {
    const today = new Date().toISOString().split("T")[0];

    const now = new Date();
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(now.getFullYear() - 1);
    const maxDate = now.toISOString().split("T")[0];
    const minDate = oneYearAgo.toISOString().split("T")[0];
    
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(today);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!description || !amount || !date) {
            alert("All fields are mandatory.");
            return;
        }

        const dataToSend = {
            description,
            amount: Number(amount),
            date
        };

        console.log("🔼 Datos enviados al backend:", dataToSend);

        try {
            const response = await axios.post('http://127.0.0.1:5000/expenses', dataToSend);

            console.log("🔽 Datos recibidos del backend:", response.data);

            onAddExpense(response.data);
            setDescription('');
            setAmount('');
            setDate(today);
        }
        catch (error) {
            console.error('Error adding expense:', error);
            setError("There's been an error adding the expense. Try again");
        }
    };
    
    return (
        <form onSubmit={handleSubmit} className="container mt-4">
            <div className="form-group">
                <label htmlFor="description">DESCRIPTION</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </div>
            
            <div className="form-group">
                <label htmlFor="amount">AMOUNT</label>
                <input
                    type="number"
                    id="amount"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
            </div>

            <div className="form-group">
                <label htmlFor="date">DATE</label>
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
            <button>
                <FontAwesomeIcon icon={faPlus} />
            </button>
        </form >

    );
};

export default AddExpense;
