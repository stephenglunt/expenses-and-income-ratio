document.addEventListener('DOMContentLoaded', () => {
    let totalExpenses = 0;
    let income1 = 0;
    let income2 = 0;
    const currencyInputs = document.querySelectorAll('.currency-input');
    const incomeField2 = document.getElementById('income2');

    currencyInputs.forEach(function(currencyInput) {
        currencyInput.addEventListener('blur', function() {
            this.value = formatCurrency(this.value);
            updateChart();
        });
    });

    currencyInputs.forEach(function(currencyInput) {
        currencyInput.addEventListener('input', function() {
            this.value = limitInput(this.value);
            updateChart();
        });
    });

    const updateChart = () => {
        let partnerIncome = incomeExpenseChart.data.labels;

        // document.getElementById('income2').value;
        expenses = document.getElementById('total').value;
        expenses = expenses.replace(/[^\d.]/g, '');
        const newRatio = partnerIncome.map(income => {
            if (income + income1 !== 0) {
                return (expenses / (income + income1)) * 100;
            } else {
                return 0;
            }
        });


        // incomeExpenseChart.data.labels = [partnerIncome];
        incomeExpenseChart.data.datasets[0].data = newRatio;
        incomeExpenseChart.update();
    };

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


        const updateTotal = () => {
            totalExpenses = 0;
            expenseInputs.forEach(input => {
                let value = input.value;
                value = value.replace(/[^\d.]/g, '');
                totalExpenses += parseFloat(value) || 0;
            });
            totalField.value = formatCurrency(totalExpenses.toString());
        }

        const updateRatio = () => {
            const incomeField1 = document.getElementById('income1');
            // const incomeField2 = document.getElementById('income2');
            income1 = parseFloat(incomeField1.value.replace(/[^\d.]/g, ''));
            income2 = parseFloat(incomeField2.value.replace(/[^\d.]/g, ''));
            income1 = income1 ? income1: 1;
            income2 = income2 ? income2: 0;
            let ratio = totalExpenses / (income1 + income2);
            ratio = ratio ? ratio : 0;
            // console.log(ratio);
            let ratioText = (ratio * 100).toString().slice(0, 5);
            const ratioField = document.getElementById('ratio');
            ratioField.textContent = "Expense/Income ratio: " + ratioText + '%';
            // console.log(temp.length);
        }

        updateTotal();
        updateRatio();
    });

    const ctx = document.getElementById('expenseIncomeChart').getContext('2d');

    let expenses = 1000;
    const partnerIncomes = [0, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000];
    const incomeToExpenseRatios = partnerIncomes.map(income => {
        if (income + income1 !== 0) {
            return (expenses / (income + income1)) * 100;
        } else {
            return (100);
        }
    });

    console.log(income1);

    const data = {
        labels: partnerIncomes,
        datasets: [{
            label: 'Income to Expense %',
            data: incomeToExpenseRatios,
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1
        }]
    };

    const config = {
        type: 'line',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Partner\'s Income ($)',
                    },
                    min: 0,
                    max: 10000
                },
                y: {
                    title: {
                        display: true,
                        text: 'Income to Expense %',
                    },
                    min: 0,
                    max: 100
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            }
        }
    };

    const incomeExpenseChart = new Chart(ctx, config);

    const incomeSlider = document.getElementById('income2-range');

    function intToCurrency(value) {
        return parseFloat(value).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    }

    incomeSlider.addEventListener('input', function() {
        const formattedValue = intToCurrency(this.value);
        incomeField2.value = formattedValue;
    });

    incomeField2.value = formatCurrency(incomeSlider.value);

    window.addEventListener('resize', () => {
        incomeExpenseChart.resize();
    });

});
