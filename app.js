const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { NOT_FOUND_ERROR_STATUS } = require('./utils/constantStatusCode');
const { createUser, login } = require('./controllers/users');
const auth = require('./middlewares/auth');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_.~#?&=]*)$/),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use(auth);

app.use(userRouter);
app.use(cardRouter);
app.use('*', (req, res) => {
  res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'URL не найден' });
});

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({ message: statusCode === 500 ? 'На сервере произошла ошибка' : message });
  // console.log(err);
  next();
});

app.listen(PORT);
