import React, { useState } from 'react';
import '../styles/styles.css';

const Dashboard = ({ expenses, onDeleteExpense, onUpdateExpense }) => { {/* Se reciben las props expenses, onDeleteExpense y onUpdateExpense */}
    const [editingId, setEditingId] = useState(null);
    const [editedExpense, setEditedExpense] = useState(null);

    const handleEditClick = (expense) => {
        setEditingId(expense.id);
        setEditedExpense({ ...expense });
    };

    const handleSaveClick = () => {
        if (!editedExpense.description || !editedExpense.amount || !editedExpense.date) {
            alert('Por favor, completa todos los campos antes de guardar.');
            return;
        }

        // Llama a la función para actualizar el gasto
        onUpdateExpense({
            ...editedExpense,
            amount: parseFloat(editedExpense.amount), // Asegúrate de que sea un número
        });

        // Limpia los estados de edición
        setEditingId(null);
        setEditedExpense(null);
    };

    const handleCancelClick = () => {
        setEditingId(null);
        setEditedExpense(null);
    };

    const handleInputChange = (field, value) => {
        setEditedExpense((prev) => ({ ...prev, [field]: value }));
    };

    if (expenses.length === 0) {
        return <p>No hay gastos registrados.</p>;
    }

    return (
        <section className="container mt-4">
            <h2 className="text-center mb-4">GASTOS</h2>
            <table className="table table-striped table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>ID</th>
                        <th>Detalle</th>
                        <th>Monto</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
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
                                            value={new Date(editedExpense.date).toISOString().split('T')[0]}
                                            onChange={(e) => handleInputChange('date', e.target.value)}
                                            required
                                        />
                                    </td>
                                    <td>
                                        <button className="btn btn-success btn-sm me-2" onClick={handleSaveClick}>
                                            Guardar
                                        </button>
                                        <button className="btn btn-secondary btn-sm" onClick={handleCancelClick}>
                                            Cancelar
                                        </button>
                                    </td>
                                </>
                            ) : (
                                <>
                                    <td>{expense.id}</td>
                                    <td>{expense.description}</td>
                                    <td>{expense.amount ? expense.amount.toLocaleString('es-PY') : 'N/A'}</td>
                                    <td>{new Date(expense.date).toLocaleDateString('es-PY')}</td>
                                    <td>
                                        <button
                                            className="btn btn-warning btn-sm me-2"
                                            onClick={() => handleEditClick(expense)}
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => onDeleteExpense(expense.id)}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
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