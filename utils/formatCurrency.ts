export const formatIndianNumber = (num: number) => {
	const parts = num.toString().split('.');
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return parts.join('.');
};

export const formatAmount = (amount: string, gst_applicable: boolean = false) => {
	if (!amount) {
		return '-';
	}
	const numAmount = gst_applicable ? 1.18 * parseFloat(amount) : parseFloat(amount);

	if (isNaN(numAmount)) {
		return 'Invalid Amount';
	}
	const formattedWhole = formatIndianNumber(Math.floor(numAmount));
	const decimalPart = numAmount % 1;
	if (decimalPart === 0) {
		return `₹${formattedWhole}`;
	} else {
		return `₹${formattedWhole}.${decimalPart.toFixed(2).split('.')[1]}`;
	}
};
