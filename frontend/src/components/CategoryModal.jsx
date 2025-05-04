import React, { useState } from 'react';
import axios from 'axios';
import "../styles/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan, faFloppyDisk, faXmark } from "@fortawesome/free-solid-svg-icons";

const CategoryModal = ({ onClose, categories, setCategories }) => {
    const [newCategory, setNewCategory] = useState("");
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedValue, setEditedValue] = useState("");

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await axios.post('http://127.0.0.1:5000/categories', { category: newCategory });
            setCategories([...categories, newCategory]);
            setNewCategory("");
        } catch (error) {
            console.error("There's been an error adding the category:", error);
        }
    };

    const handleDeleteCategory = async (category) => {
        try {
            await axios.delete(`http://127.0.0.1:5000/categories/${category}`);
            setCategories(categories.filter(cat => cat !== category));
        } catch (error) {
            console.error("There's been an error deleting the category:", error);
        }
    };

    const handleEditCategory = async (oldName) => {
        try {
            await axios.put(`http://127.0.0.1:5000/categories/${oldName}`, {
                new_name: editedValue,
            });
            setCategories(categories.map(cat => (cat === oldName ? editedValue : cat)));
            setEditingCategory(null);
            setEditedValue("");
        } catch (error) {
            console.error("There's been an error editing the category:", error);
        }
    };

    return (
        <div className="modal-overlay" onClick={(e) => e.target.classList.contains('modal-overlay') && onClose()}>
            <div className="modal-content">
                <button onClick={onClose} className="close-button">

                    <FontAwesomeIcon icon={faXmark} />
                </button>
                <h2>Manage Categories</h2>

                <div className="category-table-container">

                    <table className="category-table">
                        <thead>
                            <tr>
                                <th>Category</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.map((cat, index) => (
                                <tr key={index}>
                                    <td>
                                        {editingCategory === cat ? (
                                            <input
                                                type="text"
                                                value={editedValue}
                                                onChange={(e) => setEditedValue(e.target.value)}
                                            />
                                        ) : (
                                            cat
                                        )}
                                    </td>
                                    <td>
                                        {editingCategory === cat ? (
                                            <button onClick={() => handleEditCategory(cat)}>
                                                <FontAwesomeIcon icon={faFloppyDisk} />
                                            </button>
                                        ) : (
                                            <button onClick={() => {
                                                setEditingCategory(cat);
                                                setEditedValue(cat);
                                            }}>
                                                <FontAwesomeIcon icon={faPenToSquare} />
                                            </button>
                                        )}
                                        <button onClick={() => handleDeleteCategory(cat)}>
                                            <FontAwesomeIcon icon={faTrashCan} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="add-category-form">
                    <input
                        type="text"
                        placeholder="Nueva categoría"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                    />
                    <button onClick={handleAddCategory}>Agregar</button>
                </div>
            </div>
        </div>
    );
};

export default CategoryModal;