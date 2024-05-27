document.addEventListener('DOMContentLoaded', () => {
    const currencyInputs = document.querySelectorAll('.currency-input');

    currencyInputs.forEach(function(currencyInput) {
        currencyInput.addEventListener('blur', function() {
            this.value = formatCurrency(this.value);
        });
    });

    currencyInputs.forEach(function(currencyInput) {
        currencyInput.addEventListener('input', function() {
            this.value = limitInput(this.value);
        });
    });

    function limitInput(value) {
        // Remove leading zeros
        value = value.replace(/^0+/, '');
        // Remove non-numeric characters except for periods
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

    function formatCurrency(value) {
        value = value.replace(/[^\d.,]/g, '');
        const parts = value.split('.');

        parts[0] = parts[0].replace(/,/g, '');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

        // Combine the formatted integer part with the decimal part
        if (parts.length > 1) {
            const len = parts[1].length
            if (len < 2) {
                for (i = len; i < 2; i++) {
                    parts[1] += '0';
                }
            }
            value = parts[0] + '.' + parts[1].slice(0, 2);
        } else {
            value += ".00";
        }

        return value ? '$' + value : '';
    }

    document.addEventListener('input', () => {
        const expenseInputs = document.querySelectorAll('.expense-input');
        const totalField = document.getElementById('total');
        let total = 0;
        let income1 = 0;
        let income2 = 0;

        const updateTotal = () => {

            expenseInputs.forEach(input => {
                value = input.value;
                value = value.replace(/[^\d.]/g, '');
                total += parseFloat(value) || 0;
            });
            totalField.value = formatCurrency(total.toString());
        }

        const updateRatio = () => {
            const incomeField1 = document.getElementById('income1');
            const incomeField2 = document.getElementById('income2');
            income1 = parseFloat(incomeField1.value.replace(/[^\d.]/g, ''));
            income2 = parseFloat(incomeField2.value.replace(/[^\d.]/g, ''));
            income1 = income1 ? income1: 0;
            income2 = income2 ? income2: 0;
            let ratio = total / (income1 + income2);
            ratio = ratio ? ratio : 0;
            // console.log(ratio);
            ratioText = (ratio * 100).toString().slice(0, 5);
            const ratioField = document.getElementById('ratio');
            ratioField.textContent = "Expense/Income ratio: " + ratioText + '%';
            // console.log(temp.length);
        }

        updateTotal();
        updateRatio();
    });
});
