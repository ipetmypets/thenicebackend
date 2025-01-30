const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'actual-cpanel-host', // Replace with your actual host
    user: 'actual-cpanel-username', // Replace with your actual username
    password: 'actual-cpanel-password', // Replace with your actual password
    database: 'actual-cpanel-database' // Replace with your actual database name
});

db.connect(err => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the MySQL database');
});

app.get('/menu-items', (req, res) => {
    db.query('SELECT * FROM menu_items', (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(results);
    });
});

app.post('/menu-items', (req, res) => {
    const { name, price, image, category } = req.body;
    db.query('INSERT INTO menu_items (name, price, image, category) VALUES (?, ?, ?, ?)', [name, price, image, category], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ id: results.insertId, name, price, image, category });
    });
});

app.put('/menu-items/:id', (req, res) => {
    const { name, price, image, category } = req.body;
    db.query('UPDATE menu_items SET name = ?, price = ?, image = ?, category = ? WHERE id = ?', [name, price, image, category, req.params.id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ message: 'Menu item updated successfully' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`You can test the API at http://localhost:${PORT}/menu-items`);
});