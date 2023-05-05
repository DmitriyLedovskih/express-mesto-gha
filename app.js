const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_STATUS } = require('./utils/constantStatusCode');
const { createUser, login } = require('./controllers/users');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());

app.post('/signup', createUser);

app.post('/signin', login);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'URL не найден' });
});

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  next();
});

app.listen(PORT);
