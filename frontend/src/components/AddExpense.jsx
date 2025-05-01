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
        <form onSubmit={handleSubmit} className="form-container">

            <div className="form-inputs-container">

                <select
                    className="form-input"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required>
                    <option value="" disabled hidden>Category</option>
                    {categories && categories.map((cat, index) => (
                        <option key={index} value={cat}>{cat}</option>
                    ))}
                </select>

                <input
                    className="form-input"

                    type="number"
                    id="amount"
                    name="amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Amount"
                />

                <input
                    className="form-input"
                    type="date"
                    id="date"
                    name="date"
                    min={minDate}
                    max={maxDate}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>

            <div className="form-buttons-container">
                <button name="action" value="income" className="form-button">
                    Add Income
                </button>
                <button name="action" value="expense" className="form-button">
                    Add Expense
                </button>
            </div>
        </form>
    );
};

export default AddExpense;
