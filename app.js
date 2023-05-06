require('dotenv').config();
const express = require('express');
const { errors } = require('celebrate');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const error = require('./middlewares/error');
const router = require('./routes');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb');

const app = express();
app.use(express.json());

app.use(cookieParser());

app.use(router);

app.use(errors());
app.use(error);

app.listen(PORT);
