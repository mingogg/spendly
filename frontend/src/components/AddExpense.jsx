import React, { useState } from 'react';
import CategoryModal from './CategoryModal';
import axios from 'axios';
import '../styles/styles.css';
import { getDateLimits } from '../utils/dateUtils';
import { API } from '../config';
const { minDate, maxDate } = getDateLimits();

const AddExpense = ({
    onAddExpense,
    categories,
    setCategories,
    fetchCategories,
}) => {
    const [error, setError] = useState(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(maxDate);

    const [showModal, setShowModal] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const entrytype = e.nativeEvent.submitter.value;

        if (!description || !amount || !date) {
            alert('All fields are mandatory.');
            return;
        }

        const dataToSend = {
            description,
            amount: Number(amount),
            date,
            entrytype,
        };

        /* console.log('🔼 Datos enviados al backend:', dataToSend); */

        try {
            const response = await axios.post(
                `${API}/api/expenses`,
                dataToSend,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );

            /* console.log('🔽 Datos recibidos del backend:', response.data); */

            onAddExpense(response.data);
            setDescription('');
            setAmount('');
            setDate(maxDate);
        } catch (error) {
            console.error('Error adding expense:', error);
            setError("There's been an error adding the expense. Try again");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="form-container">
                <div className="form-inputs-container">
                    <select
                        className="form-input"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    >
                        <option value="" disabled hidden>
                            Category
                        </option>
                        {categories &&
                            categories.map((cat, index) => (
                                <option key={index} value={cat}>
                                    {cat}
                                </option>
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
                    <button
                        type="button"
                        className="form-button"
                        onClick={() => setShowModal(true)}
                    >
                        Edit Categories
                    </button>
                    <button
                        name="action"
                        value="income"
                        className="form-button"
                    >
                        Add Income
                    </button>
                    <button
                        name="action"
                        value="expense"
                        className="form-button"
                    >
                        Add Expense
                    </button>
                </div>
            </form>

            {showModal && (
                <CategoryModal
                    categories={categories}
                    setCategories={setCategories}
                    fetchCategories={fetchCategories}
                    onClose={() => setShowModal(false)}
                />
            )}
        </>
    );
};

export default AddExpense;
