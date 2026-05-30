const formatCurrency = (price = 0) => `₹${Number(price || 0).toLocaleString("en-IN")}`;

export default formatCurrency;
