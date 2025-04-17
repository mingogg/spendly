export const calculateBalance = (expenses) =>{
    const balanceIncome = expenses.reduce((acumIncome, gasto) => gasto.entrytype === 'income' ? acumIncome + gasto.amount : acumIncome, 0);    
    const balanceExpense = expenses.reduce((acumExpense, gasto) => gasto.entrytype === 'expense' ? acumExpense + gasto.amount : acumExpense, 0);
    const balanceTotal = balanceIncome - balanceExpense;

    return { balanceIncome, balanceTotal, balanceExpense };
}