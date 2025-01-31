// filepath: /Users/urvi/Create Web/thenicebackend/server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());

app.get('/menu-items', (req, res) => {
    console.log('GET request to /menu-items');
    db.query('SELECT * FROM menu_items', (err, results) => {
        if (err) {
            console.error('Error fetching menu items:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Fetched menu items:', results);
        res.json(results);
    });
});

app.post('/menu-items', (req, res) => {
    const { name, price, image, category } = req.body;
    console.log('POST request to /menu-items with data:', { name, price, image, category });
    db.query('INSERT INTO menu_items (name, price, image, category) VALUES (?, ?, ?, ?)', [name, price, image, category], (err, results) => {
        if (err) {
            console.error('Error inserting menu item:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Inserted menu item with ID:', results.insertId);
        res.json({ id: results.insertId, name, price, image, category });
    });
});

app.put('/menu-items/:id', (req, res) => {
    const { name, price, image, category } = req.body;
    console.log('PUT request to /menu-items/:id with data:', { id: req.params.id, name, price, image, category });
    db.query('UPDATE menu_items SET name = ?, price = ?, image = ?, category = ? WHERE id = ?', [name, price, image, category, req.params.id], (err, results) => {
        if (err) {
            console.error('Error updating menu item:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Updated menu item with ID:', req.params.id);
        res.json({ message: 'Menu item updated successfully' });
    });
});

app.delete('/menu-items/:id', (req, res) => {
    console.log('DELETE request to /menu-items/:id with ID:', req.params.id);
    db.query('DELETE FROM menu_items WHERE id = ?', [req.params.id], (err, results) => {
        if (err) {
            console.error('Error deleting menu item:', err);
            return res.status(500).json({ error: err.message });
        }
        console.log('Deleted menu item with ID:', req.params.id);
        res.json({ message: 'Item deleted' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`You can test the API at http://localhost:${PORT}/menu-items`);
});