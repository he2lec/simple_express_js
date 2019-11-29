const express = require('express');
const app = express();
const mysql = require('mysql');
const dotenv = require('dotenv');

dotenv.config();

const connection = mysql.createConnection({
  host     : process.env.MYSQL_HOST,
  user     : process.env.MYSQL_USER,
  password : process.env.MYSQL_PWD
});

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.get('/users', function (req, res) {
  res.send('Hello World!')
});

app.listen(process.env.PORT, function () {
  console.log(`App listening on port ${process.env.PORT}!`)
});
