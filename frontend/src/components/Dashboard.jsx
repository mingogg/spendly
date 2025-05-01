import React, { useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";
import "../styles/styles.css";
import { getDateLimits, formatDateView, unformatDate } from "../utils/dateUtils.js";

const { minDate, maxDate } = getDateLimits();

const Dashboard = ({ expenses, onDeleteExpense, onUpdateExpense, categories }) => {
    const [editingId, setEditingId] = useState(null);
    const [editedExpense, setEditedExpense] = useState(null);
    const [sortConfig, setSortConfig] = useState({ key: "date", direction: "asc" });

    const dateRef = useRef();
    const descRef = useRef();
    const amountRef = useRef();

    const sortedExpenses = [...expenses].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (sortConfig.key === "date") {
            return sortConfig.direction === "desc"
                ? new Date(unformatDate(aValue)) - new Date(unformatDate(bValue))
                : new Date(unformatDate(bValue)) - new Date(unformatDate(aValue));
        }

        return sortConfig.direction === "asc"
            ? aValue > bValue
                ? 1
                : -1
            : aValue < bValue
                ? 1
                : -1;
    });

    const handleSort = (key) => {
        setSortConfig((prev) => ({
            key,
            direction:
                prev.key === key && prev.direction === "desc" ? "asc" : "desc",
        }));
    };

    const handleEditClick = (expense) => {
        setEditingId(expense.id);

        setEditedExpense({ ...expense, date: unformatDate(expense.date) });
    };

    const handleSaveClick = () => {
        if (!dateRef.current.reportValidity()) return;
        if (!descRef.current.reportValidity()) return;
        if (!amountRef.current.reportValidity()) return;

        const dateValue = new Date(editedExpense.date);
        const min = new Date(minDate);
        const max = new Date(maxDate);

        if (dateValue < min || dateValue > max) {
            alert(`The date must be between ${minDate} and ${maxDate}`);
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

    const handleInputChange = (field, value) => {
        setEditedExpense((prev) => ({ ...prev, [field]: value }));
    };

    return (
        <>
            {expenses.length === 0 ? (
                <p className="no-expenses">There are no expenses registered.</p>
            ) : (
                <section className="dashboard-container">
                    <table>
                        <thead className="table-header">
                            <tr>
                                <th onClick={() => handleSort("date")} className="dashboard-filter-hover">
                                    DATE {sortConfig.key === "date" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSort("description")} className="dashboard-filter-hover">
                                    CATEGORY {sortConfig.key === "description" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </th>
                                <th onClick={() => handleSort("amount")} className="dashboard-filter-hover">
                                    AMOUNT {sortConfig.key === "amount" && (sortConfig.direction === "asc" ? "▲" : "▼")}
                                </th>
                                <th>ACTIONS</th>
                            </tr>
                        </thead>

                        <tbody>
                            {sortedExpenses.map((expense) => (
                                <tr key={expense.id}>
                                    {editingId === expense.id ? (
                                        <>
                                            <td>
                                                <input
                                                    type="date"
                                                    ref={dateRef}
                                                    value={editedExpense.date}
                                                    min={minDate}
                                                    max={maxDate}
                                                    onChange={(e) => handleInputChange("date", e.target.value)}
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <select ref={descRef}
                                                    value={editedExpense.description}
                                                    onChange={(e) => handleInputChange("description", e.target.value)}
                                                    required>
                                                    {categories.map((cat, index) => (
                                                        <option key={index} value={cat}>
                                                            {cat}
                                                        </option>
                                                    ))}
                                                </select>
                                            </td>
                                            <td>
                                                <input
                                                    type="number"
                                                    ref={amountRef}
                                                    max={1000000000}
                                                    value={editedExpense.amount}
                                                    onChange={(e) => handleInputChange("amount", e.target.value)}
                                                    required
                                                />
                                            </td>
                                            <td>
                                                <div className="dashboard-buttons-div">
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
                                            <td>
                                                {formatDateView(expense.date)}
                                            </td>
                                            <td>{expense.description}</td>
                                            <td>
                                                <div className={expense.entrytype === "income" ? "amount-chip income" : "amount-chip expense"}>
                                                    {expense.amount.toLocaleString("es-PY")} ₲
                                                </div>
                                            </td>
                                            <td>
                                                <div className="dashboard-buttons-div">
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
            )}
        </>
    );
};

export default Dashboard;
