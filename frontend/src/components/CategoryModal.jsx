import React, { useState } from 'react';
import axios from 'axios';
import '../styles/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPenToSquare,
    faTrashCan,
    faFloppyDisk,
    faXmark,
} from '@fortawesome/free-solid-svg-icons';

const CategoryModal = ({
    categories,
    setCategories,
    fetchCategories,
    onClose,
}) => {
    const [newCategory, setNewCategory] = useState('');
    const [editingCategory, setEditingCategory] = useState(null);
    const [editedValue, setEditedValue] = useState('');

    const handleAddCategory = async () => {
        if (!newCategory.trim()) return;
        try {
            await axios.post(
                'http://127.0.0.1:5000/api/categories',
                { category: newCategory },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );
            setCategories([...categories, newCategory]);
            setNewCategory('');
        } catch (error) {
            console.error("There's been an error adding the category:", error);
            if (error.response?.status === 409) {
                alert('Esa categoría ya existe');
            } else {
                alert('Error al agregar la categoría');
            }
        }
    };

    const handleDeleteCategory = async (category) => {
        if (!window.confirm(`¿Eliminar la categoría "${category}"?`)) return;

        try {
            await axios.delete(
                `http://127.0.0.1:5000/api/categories/${encodeURIComponent(
                    category
                )}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );

            // Actualizar lista
            fetchCategories();
        } catch (error) {
            console.error(
                "There's been an error deleting the category:",
                error
            );
            alert('Error al eliminar la categoría');
        }
    };

    const handleEditCategory = async (oldName) => {
        try {
            await axios.put(
                `http://127.0.0.1:5000/api/categories/${encodeURIComponent(
                    oldName
                )}`,
                { new_name: editedValue },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            'token'
                        )}`,
                    },
                }
            );

            fetchCategories(); // actualizá las categorías desde el backend
            setEditingCategory(null);
            setEditedValue('');
        } catch (error) {
            console.error("There's been an error editing the category:", error);
            alert('Error al editar la categoría');
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={(e) =>
                e.target.classList.contains('modal-overlay') && onClose()
            }
        >
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
                                                onChange={(e) =>
                                                    setEditedValue(
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        ) : (
                                            cat
                                        )}
                                    </td>
                                    <td>
                                        {editingCategory === cat ? (
                                            <button
                                                onClick={() =>
                                                    handleEditCategory(cat)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faFloppyDisk}
                                                />
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => {
                                                    setEditingCategory(cat);
                                                    setEditedValue(cat);
                                                }}
                                            >
                                                <FontAwesomeIcon
                                                    icon={faPenToSquare}
                                                />
                                            </button>
                                        )}
                                        <button
                                            onClick={() =>
                                                handleDeleteCategory(cat)
                                            }
                                        >
                                            <FontAwesomeIcon
                                                icon={faTrashCan}
                                            />
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
