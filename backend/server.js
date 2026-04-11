const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: 'root'
};

// Create a connection just to create the DB and table
const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a MySQL (Asegúrate de que MySQL está activo en XAMPP/Local):', err.message);
    return;
  }
  console.log('✅ Conectado a MySQL exitosamente.');

  // Initialize DB and Table
  connection.query(`CREATE DATABASE IF NOT EXISTS agencia`, (err) => {
    if (err) throw err;
    console.log('✅ Base de datos "agencia" lista.');

    connection.query(`USE agencia`, (err) => {
      if (err) throw err;

      const createTableQuery = `
        CREATE TABLE IF NOT EXISTS clientes (
          id INT AUTO_INCREMENT PRIMARY KEY,
          nombre VARCHAR(100) NOT NULL,
          apellido VARCHAR(100) NOT NULL,
          cedula VARCHAR(20) NOT NULL,
          email VARCHAR(150),
          telefono VARCHAR(20),
          sexo CHAR(1),
          direccion VARCHAR(255),
          fecha_nacimiento DATE,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `;
      connection.query(createTableQuery, (err) => {
        if (err) throw err;
        console.log('✅ Tabla "clientes" lista.');
      });
    });
  });
});

// Create Pool for API queries
const pool = mysql.createPool({
  ...dbConfig,
  database: 'agencia',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Endpoint to save client
app.post('/api/clientes', (req, res) => {
  const { nombre, apellido, cedula, email, telefono, sexo, direccion, fechaNacimiento } = req.body;
  
  const query = `INSERT INTO clientes (nombre, apellido, cedula, email, telefono, sexo, direccion, fecha_nacimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  
  pool.query(query, [nombre, apellido, cedula, email, telefono, sexo, direccion, fechaNacimiento], (err, results) => {
    if (err) {
      console.error('Error insertando cliente:', err);
      return res.status(500).json({ error: 'Error al guardar el cliente en la base de datos' });
    }
    
    res.status(201).json({
      exito: true,
      mensaje: 'El cliente fue guardado correctamente en MySQL.',
      idCliente: results.insertId
    });
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
