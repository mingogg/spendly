import React, { useState } from "react";
import axios from "axios";
import "../styles/styles.css";
import { getDateLimits } from "../utils/dateUtils";

const { minDate, maxDate } = getDateLimits();

const AddExpense = ({ onAddExpense, categories }) => {
    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [date, setDate] = useState(maxDate);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const entrytype = e.nativeEvent.submitter.value;

        if (!description || !amount || !date) {
            alert("All fields are mandatory.");
            return;
        }

        const dataToSend = {
            description,
            amount: Number(amount),
            date,
            entrytype,
        };

        console.log("🔼 Datos enviados al backend:", dataToSend);

        try {
            const response = await axios.post("http://127.0.0.1:5000/expenses", dataToSend);

            console.log("🔽 Datos recibidos del backend:", response.data);

            onAddExpense(response.data);
            setDescription("");
            setAmount("");
            setDate(maxDate);
        } catch (error) {
            console.error("Error adding expense:", error);
            setError("There's been an error adding the expense. Try again");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="container">

            <div className="form-inputs">
                <div className="form-group">
                    <label htmlFor="description">CATEGORY</label>
                    <select value={description} onChange={(e) => setDescription(e.target.value)} required>
                        <option value="">Select...</option>
                        {categories && categories.map((cat, index) => (
                            <option key={index} value={cat}>{cat}</option>
                        ))}
                    </select>
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
                        id="date"
                        name="date"
                        min={minDate}
                        max={maxDate}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="form-buttons">
                <div className="addExpense-buttons-div">
                    <button name="action" value="income" className="boton">
                        Add income
                    </button>
                    <button name="action" value="expense">
                        Add Expense
                    </button>
                </div>
            </div>
        </form>
    );
};

export default AddExpense;
