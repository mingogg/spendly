export const getDateLimits = (yearsBack = 5) => {
    const today = new Date();
    const past = new Date();
    past.setFullYear(today.getFullYear() - yearsBack);

    const format = (d) => d.toISOString().split("T")[0];
    return {
        maxDate: format(today),
        minDate: format(past),
    };
};



export const formatDateView = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return `${day}/${month}/${year}`;
};



export const unformatDate = (dateStr) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        return dateStr;
    }

    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`;
};