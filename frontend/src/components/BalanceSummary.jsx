import React from 'react';
import { BanknoteArrowUp, BanknoteArrowDown, Scale } from 'lucide-react';
import '../styles/styles.css';

const BalanceSummary = ({ balanceIncome, balanceExpense, balanceTotal }) => {

    return (
        <div className="balance-summary">
            <div className="summary-card income-card">
                <div className='icon-wrapper'><BanknoteArrowUp className='icon-custom' /></div>

                <div className="summary-info">
                    <span className="summary-label">Income</span>
                    <span className="summary-amount">{balanceIncome?.toLocaleString('es-PY')} ₲</span>
                </div>
            </div>


            <div className="summary-card expense-card">
                <div className='icon-wrapper'><BanknoteArrowDown className='icon-custom' /></div>

                <div className="summary-info">
                    <span className="summary-label">Expense</span>
                    <span className="summary-amount">{balanceExpense?.toLocaleString('es-PY')} ₲</span>
                </div>

            </div>

            <div className="summary-card balance-card">
                <div className='icon-wrapper'><Scale className='icon-custom' /></div>

                <div className="summary-info">
                    <span className="summary-label">Balance</span>
                    <span className="summary-amount">{balanceTotal?.toLocaleString('es-PY')} ₲</span>

                </div>
            </div>

        </div>
    );
};

export default BalanceSummary;
