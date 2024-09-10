const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mysql = require('mysql'); // Asegúrate de tener el paquete mysql instalado

const app = express();
const port = 4000;

// Configura la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'tccesp.cra46uwu2j45.us-east-2.rds.amazonaws.com',
  user: 'admin',
  password: 'Tcc2024*',
  database: 'TccEsp1'
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    process.exit(1); // Detén el proceso si no se puede conectar a la base de datos
  }
  console.log('Conectado a la base de datos');
});

// Middleware para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Ruta para servir el archivo login.html cuando se acceda a la raíz del sitio
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

// Ruta para manejar el inicio de sesión
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Consulta a la base de datos para verificar las credenciales
  const query = 'SELECT * FROM usuario WHERE nombre_usuario = ? AND contrasena = ?';
  connection.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ success: false, message: 'Error en el servidor' });
    }

    if (results.length > 0) {
      // Si el usuario existe, redirigir al menú
      res.json({ success: true });
    } else {
      // Si las credenciales no coinciden
      res.json({ success: false, message: 'Usuario o contraseña incorrectos' });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
