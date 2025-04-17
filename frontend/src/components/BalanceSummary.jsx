import React from 'react';
import '../styles/styles.css';

const BalanceSummary = ({ balanceIncome, balanceExpense, balanceTotal }) => {

    return (
        <div className="total-balance">
            <h4 className='balance'>INCOME: {balanceIncome?.toLocaleString('es-PY')} ₲</h4>
            <h4 className='balance'>EXPENSE: {balanceExpense?.toLocaleString('es-PY')} ₲</h4>
            <h4 className='balance'>BALANCE: {balanceTotal?.toLocaleString('es-PY')} ₲</h4>
        </div>
    );
};

export default BalanceSummary;
