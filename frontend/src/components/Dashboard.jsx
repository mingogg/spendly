import React, { useState } from 'react';
import '../styles/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faFloppyDisk, faXmark } from '@fortawesome/free-solid-svg-icons';


const Dashboard = ({ expenses, onDeleteExpense, onUpdateExpense }) => {

    const [editingId, setEditingId] = useState(null);
    const [editedExpense, setEditedExpense] = useState(null);

    const balance = expenses.reduce((acum, gasto) => {
        return acum + gasto.amount;
    }, 0);
    
    const handleEditClick = (expense) => {
        setEditingId(expense.id);
        setEditedExpense({ ...expense });
    };

    const handleSaveClick = () => {
        if (!editedExpense.description || !editedExpense.amount || !editedExpense.date) {
            alert('Please fill all the fields before saving.');
            return;
        }

        if (editedExpense.amount > 1000000000) {
            alert("The amount can't surpass the 1.000 million.");
            return;
        }

        onUpdateExpense({
            ...editedExpense,
            amount: parseFloat(editedExpense.amount), 
        });

        setEditingId(null);
        setEditedExpense(null);
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditedExpense(null);
    };

    const formatDate = (dateStr) => {
        const [day, month, year] = dateStr.split("-");
        return `${day}/${month}/${year}`;
    };

    const handleInputChange = (field, value) => {
        setEditedExpense((prev) => ({ ...prev, [field]: value }));
    };

    if (expenses.length === 0) {
        return <p className='no-expenses'>There are no expenses registered.</p>;
    }

    console.log("Gastos actuales:", expenses);
    return (
        <section className="container mt-4">
            <h2 className="text-center mb-4">BALANCE {balance.toLocaleString('es-PY')} ₲</h2>

            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>N°</th>
                        <th>DESCRIPTION</th>
                        <th>AMOUNT</th>
                        <th>DATE</th>
                        <th>MODIFIY</th>
                    </tr>
                </thead>
                <tbody>
                    {expenses.map((expense) => (
                        <tr key={expense.id}>
                            {editingId === expense.id ? (
                                <>
                                    <td>{expense.id}</td>
                                    <td>
                                        <input
                                            type="text"
                                            value={editedExpense.description}
                                            onChange={(e) => handleInputChange('description', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="number"
                                            value={editedExpense.amount}
                                            onChange={(e) => handleInputChange('amount', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="date"
                                            value={
                                                editedExpense.date && !isNaN(new Date(editedExpense.date))
                                                ? new Date(editedExpense.date).toISOString().split("T")[0]
                                                : ""
                                            }
                                            onChange={(e) => handleInputChange("date", e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td >
                                        <div className='dashboard-buttons-div'>
                                            <button onClick={handleSaveClick}>
                                                <FontAwesomeIcon icon={faFloppyDisk} />
                                            </button>
                                            <button onClick={handleCancelClick}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{expense.id}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.amount ? expense.amount.toLocaleString('es-PY') : 'N/A'}</td>
                                    <td>{formatDate(expense.date)}</td>
                                    <td>
                                        <div className='dashboard-buttons-div'>
                                            <button onClick={() => handleEditClick(expense)}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </button>
                                            <button onClick={() => onDeleteExpense(expense.id)}>
                                                <FontAwesomeIcon icon={faTrashCan} />
                                            </button>
                                        </div>
                                    </td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
};

export default Dashboard;
