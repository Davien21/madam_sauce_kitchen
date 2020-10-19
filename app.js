const winston = require('winston');
const express = require('express');
const app = express();

require('express-async-errors');

require('./startup/db')();
require('./startup/logging')();

const meals = require('./routes/meals')
const admins = require('./routes/admins')
const auth = require('./routes/auth')

const error = require('./middleware/error')

app.use(express.json());
app.use('/api/meals', meals) // use the meals router;
app.use('/api/admins', admins) // use the admins router;
app.use('/api/auth', auth) // use the auth router;
 
//error middleware
app.use(error);

const port = process.env.PORT || 3000;


const server = app.listen(port, () => winston.info(`Server running at port ${port}`));

module.exports = server;






// Set up middleware: auth, admin, validate, etc.