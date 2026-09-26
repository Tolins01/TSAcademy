require('dotenv').config();

const express = require('express');
const connectDB = require('./Config/mongodb');

const customerRoute = require('./Routers/CustomerRoute');
const accountRoute = require('./Routers/AccountRoute');
const transactionRoute = require('./Routers/TransactionRoute');
const bankValidationRoute = require('./Routers/BankValidationRoute');
const newBankRoute = require('./Routers/NewBankRoute');

const app = express();

app.use(express.json());

connectDB();

app.get('/', (req, res) => {
  res.json({ message: 'TSBank API is running' });
});

app.use('/account', customerRoute);
app.use('/accounts', accountRoute);
app.use('/transactions', transactionRoute);
app.use('/nibss', bankValidationRoute);
app.use('/banks', newBankRoute);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;
