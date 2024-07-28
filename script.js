document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses');
    const totalAmountElem = document.getElementById('total-amount');

    form.addEventListener('submit', addExpense);

    function formatCurrency(amount) {
        return amount.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    }

    function updateTotal() {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const total = expenses.reduce((acc, curr) => acc + parseFloat(curr.amount), 0);
        totalAmountElem.textContent = formatCurrency(total);
    }

    function displayExpenses() {
        expenseList.innerHTML = '';
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses.forEach(expense => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.description} - ${formatCurrency(parseFloat(expense.amount))} (${expense.category})
                <button onclick="deleteExpense(${expense.id})"><i class="fas fa-trash"></i> Delete</button>
            `;
            expenseList.appendChild(li);
        });
        updateTotal();
    }

    function addExpense(event) {
        event.preventDefault();
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;

        if (description && amount && category) {
            const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
            const newExpense = {
                id: Date.now(),
                description,
                amount,
                category
            };
            expenses.push(newExpense);
            localStorage.setItem('expenses', JSON.stringify(expenses));
            form.reset();
            displayExpenses();
        }
    }

    window.deleteExpense = function(id) {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
    };

    displayExpenses();
});
