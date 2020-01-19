const express = require('express');
const app = express();
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const api = require('./api');
const cors = require('cors');


dotenv.config();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/users', api.getUsers)
app.get('/users/:id', api.getUserById)
app.post('/users', api.createUser)
app.put('/users/:id', api.updateUser)
app.delete('/users/:id', api.deleteUser)

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.listen(process.env.PORT, function () {
  console.log(`App listening on port ${process.env.PORT}!`)
});
