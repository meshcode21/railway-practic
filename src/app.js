import express from 'express';
import mysql from 'mysql2';

const app = express();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err);
        return;
    }
    console.log('Connected to the database');
});

app.get('/users', (req, res) => {
    connection.query('SELECT * FROM users', (error, results) => {
        if (error) {
            console.error('Error fetching users:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

app.post('/users', express.json(), (req, res) => {
    connection.query('insert into users (name, email,password) values (?,?,?)', [req.body.name, req.body.email, req.body.password], (error, results) => {
        if (error) {
            console.error('Error inserting user:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.status(201).json({ id: results.insertId, ...req.body });
    });
});

export default app;