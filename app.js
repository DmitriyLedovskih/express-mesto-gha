const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_STATUS } = require('./utils/constantStatusCode');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6441a31b3ea479acddb1c341',
  };

  next();
});

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'URL не найден' });
});

app.listen(PORT);
