document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expenseList = document.getElementById('expenses');
    const totalAmountElem = document.getElementById('total-amount');
    const expenseIdField = document.getElementById('expense-id');

    form.addEventListener('submit', addOrEditExpense);

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
                <button class="edit" onclick="editExpense(${expense.id})"><i class="fas fa-edit"></i> Edit</button>
                <button class="delete" onclick="deleteExpense(${expense.id})"><i class="fas fa-trash"></i> Delete</button>
            `;
            expenseList.appendChild(li);
        });
        updateTotal();
    }

    function addOrEditExpense(event) {
        event.preventDefault();
        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const category = document.getElementById('category').value;
        const id = expenseIdField.value;

        if (description && amount && category) {
            let expenses = JSON.parse(localStorage.getItem('expenses')) || [];

            if (id) {
                // Edit expense
                expenses = expenses.map(expense => expense.id === parseInt(id) ? { id: parseInt(id), description, amount, category } : expense);
            } else {
                // Add expense
                const newExpense = {
                    id: Date.now(),
                    description,
                    amount,
                    category
                };
                expenses.push(newExpense);
            }

            localStorage.setItem('expenses', JSON.stringify(expenses));
            form.reset();
            expenseIdField.value = '';
            displayExpenses();
        }
    }

    window.editExpense = function(id) {
        const expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        const expense = expenses.find(expense => expense.id === id);
        if (expense) {
            document.getElementById('description').value = expense.description;
            document.getElementById('amount').value = expense.amount;
            document.getElementById('category').value = expense.category;
            expenseIdField.value = expense.id;
        }
    };

    window.deleteExpense = function(id) {
        let expenses = JSON.parse(localStorage.getItem('expenses')) || [];
        expenses = expenses.filter(expense => expense.id !== id);
        localStorage.setItem('expenses', JSON.stringify(expenses));
        displayExpenses();
    };

    displayExpenses();
});
