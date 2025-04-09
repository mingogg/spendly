// src/components/EditExpense.jsx

import React, { useState } from 'react';


const EditExpense = ({ expense, onUpdateExpense, onCancel }) => {
    console.log("📦 EditExpense cargado correctamente");
    const [form, setForm] = useState({ ...expense });

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        if (!form.description || !form.amount || !form.date) {
            alert("Completa todos los campos");
            return;
        }

        onUpdateExpense(form);
    };

    return (
        <div className="container mt-4">
            <h2>Editar Gasto</h2>
            <input
                type="text"
                value={form.description}
                onChange={(e) => handleChange('description', e.target.value)}
            />
            <input
                type="number"
                min={1}
                max={1000000000}
                value={form.amount}
                onChange={(e) => handleChange('amount', Number(e.target.value))}
            />
            <input
                type="date"
                value={form.date}
                onChange={(e) => handleChange('date', e.target.value)}
            />
            <button className="btn btn-success" onClick={handleSave}>Guardar</button>
            <button className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
        </div>
    );
};

export default EditExpense;
