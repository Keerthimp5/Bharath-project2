const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Connected to MongoDB');
});

// Define entry schema
const entrySchema = new mongoose.Schema({
    description: String,
    amount: Number,
    type: String
});
const Entry = mongoose.model('Entry', entrySchema);

// Middleware
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/entries', (req, res) => {
    Entry.find({}, (err, entries) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            res.json({ entries: entries });
        }
    });
});

app.post('/entry', (req, res) => {
    const { description, amount, type } = req.body;
    const newEntry = new Entry({ description, amount, type });
    newEntry.save((err, entry) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            Entry.find({}, (err, entries) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ entries: entries });
                }
            });
        }
    });
});

app.delete('/entry/:id', (req, res) => {
    const id = req.params.id;
    Entry.findByIdAndDelete(id, (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal server error' });
        } else {
            Entry.find({}, (err, entries) => {
                if (err) {
                    console.error(err);
                    res.status(500).json({ error: 'Internal server error' });
                } else {
                    res.json({ entries: entries });
                }
            });
        }
    });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
