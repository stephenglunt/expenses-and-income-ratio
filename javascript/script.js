const currencyInputs = document.querySelectorAll('.currency-input');

currencyInputs.forEach(function(currencyInput) {
    currencyInput.addEventListener('input', function() {
        this.value = formatCurrency(this.value);
    });
});
// .addEventListener('input', function() {
//     this.value = formatCurrency(this.value);
// });

function formatCurrency(value) {
    // Remove leading zeros
    value = value.replace(/^0+/, '');
    // Remove non-numeric characters except for periods and commas
    value = value.replace(/[^\d.]/g, '');

    // Handle multiple decimal points
    const parts = value.split('.');
    if (parts.length > 2) {
        parts[1] = parts.slice(1).join('');
    }

    // Format the integer part with commas
    const integerPart = parts[0].replace(/,/g, '');
    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Combine the formatted integer part with the decimal part
    if (parts.length > 1) {
        value = formattedIntegerPart + '.' + parts[1].slice(0, 2); // Limit to 2 decimal places
    } else {
        value = formattedIntegerPart;
    }

    return value ? '$' + value : '';
}
