document.addEventListener('DOMContentLoaded', function() {
    const expenseForm = document.getElementById('expenseForm');
    const entriesContainer = document.getElementById('entries');

    expenseForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const description = document.getElementById('description').value;
        const amount = document.getElementById('amount').value;
        const type = document.getElementById('type').value;

        const entry = {
            description: description,
            amount: amount,
            type: type
        };

        fetch('/entry', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entry)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            renderEntries(data.entries);
        })
        .catch(error => console.error('Error:', error));
    });

    function renderEntries(entries) {
        entriesContainer.innerHTML = '';

        entries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.classList.add('entry');
            entryElement.innerHTML = `
                <span>${entry.description} - ${entry.amount}</span>
                <button onclick="deleteEntry('${entry._id}')">Delete</button>
            `;
            entriesContainer.appendChild(entryElement);
        });
    }

    function deleteEntry(id) {
        fetch(`/entry/${id}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            renderEntries(data.entries);
        })
        .catch(error => console.error('Error:', error));
    }

    fetch('/entries')
        .then(response => response.json())
        .then(data => {
            console.log(data);
            renderEntries(data.entries);
        })
        .catch(error => console.error('Error:', error));
});
