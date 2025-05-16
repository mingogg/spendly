import React from 'react';
import '../styles/styles.css';
import {
    faHouse,
    faChartLine,
    faUser,
    faRightFromBracket,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Sidebar = ({ onLogout, username }) => {
    return (
        <aside className="sidebar">
            <div>
                <div className="sidebar-logo">
                    <img
                        src="../../assets/company-logo.png"
                        alt="Logo"
                        className="sidebar-logo-icon"
                    />
                    Spendly
                </div>

                <nav className="sidebar-nav">
                    <ul>
                        <li className="sidebar-item active">
                            <FontAwesomeIcon icon={faHouse} /> Dashboard
                        </li>
                        <li className="sidebar-item">
                            <FontAwesomeIcon icon={faChartLine} /> Recovery Plan
                        </li>
                    </ul>
                </nav>
            </div>

            <div className="sidebar-footer">
                <span className="sidebar-user">
                    <FontAwesomeIcon icon={faUser} /> User: {username}
                </span>
                <button className="logout-button" onClick={onLogout}>
                    <FontAwesomeIcon icon={faRightFromBracket} /> Logout
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
