const express = require('express');
const app = express();
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const { encrypt, decrypt } = require('./EncryptionHandler');

// for settings connection between frontend and backend
app.use(cors());
// express.json to recieve on backend
app.use(express.json());

const db = mysql.createConnection({
  user: 'root',
  host: 'localhost',
  password: 'bobisfat',
  database: 'passwordmanager',
});

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/addcreds', (req, res) => {
  const { password, title } = req.body;
  const hashedPassword = encrypt(password);
  db.query(
    'INSERT INTO password (password, title, iv) VALUES (?,?,?)',
    [hashedPassword.password, title, hashedPassword.iv],
    (err, result) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Success');
      }
    }
  );
});

app.get('/showpasswords', (req, res) => {
  db.query('SELECT * FROM password', (err, result) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.post('/decryptpassword', (req, res) => {
  res.send(decrypt(req.body));
  // db.query
});

const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}...`);
});
