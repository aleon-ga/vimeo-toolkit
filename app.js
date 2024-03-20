require('dotenv').config();
require('module-alias/register');
const express = require('express');
const cors = require('cors');
const { errorHandler } = require('@helpers');

// App init
const app = express();

// Middlewares
app.use([
    cors(),
    express.json(),
    express.urlencoded({ extended: true })
]);

// Routes
app.use('/api/v1', require('@routes'));

// Default error handler
app.use(errorHandler);

// Server port
const port = process.env.PORT || 3000;

// Start server
const server = app.listen(port, () => console.log(`App listening on port ${port}`));

process.on('warning', (error) => console.warn(error.stack));

module.exports = { app, server };
