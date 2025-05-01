import React from 'react';
import { BanknoteArrowUp, BanknoteArrowDown, Scale } from 'lucide-react';
import '../styles/styles.css';

const BalanceSummary = ({ balanceIncome, balanceExpense, balanceTotal }) => {

    return (
        <div className="cards-container">
            <div className="cards income-card">
                <div className='icon-wrapper'><BanknoteArrowUp className='icon-custom' /></div>

                <div className="cards-info">
                    <span className="cards-info-label">Income</span>
                    <span className="cards-info-amount">{balanceIncome.toLocaleString('es-PY')}&nbsp;₲</span>
                </div>
            </div>


            <div className="cards expense-card">
                <div className='icon-wrapper'><BanknoteArrowDown className='icon-custom' /></div>

                <div className="cards-info">
                    <span className="cards-info-label">Expenses</span>
                    <span className="cards-info-amount">-{balanceExpense.toLocaleString('es-PY')}&nbsp;₲</span>
                </div>

            </div>

            <div className="cards balance-card" style={{ backgroundColor: balanceTotal > 0 ? '#72b8ee' : '#3f87c3' }}>
                <div className='icon-wrapper'><Scale className='icon-custom' /></div>

                <div className="cards-info">
                    <span className="cards-info-label">Balance</span>
                    <span className="cards-info-amount">{balanceTotal.toLocaleString('es-PY')}&nbsp;₲</span>

                </div>
            </div>

        </div>
    );
};

export default BalanceSummary;
