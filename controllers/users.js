const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { ValidationError } = require('mongoose').Error;
const User = require('../models/user');
const {
  CREATE_STATUS,
} = require('../utils/constants');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');
const sendUser = require('../utils/sendUser');

const { NODE_ENV, JWT_SECRET } = process.env;

const updateData = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, req.body, { new: true, runValidators: true })
    .then((user) => sendUser(res, user))
    .catch((err) => {
      if (err instanceof ValidationError) {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

const getUsers = (req, res, next) => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => sendUser(res, user))
    .catch(next);
};

const getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => sendUser(res, user))
    .catch(next);
};

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
        .then((user) => res.status(CREATE_STATUS).send({ data: user }))
        .catch((err) => {
          if (err.code === 11000) {
            next(new ConflictError('Email уже занят'));
          } else if (err instanceof ValidationError) {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    })
    .catch(next);
};

const updateProfile = (req, res, next) => updateData(req, res, next);

const updateProfileAvatar = (req, res, next) => updateData(req, res, next);

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'some-key',
        { expiresIn: '7d' },
      );

      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
      }).send({ email });
    })
    .catch(next);
};

const signOut = (req, res) => {
  res.clearCookie('token').send({ message: 'Вы вышли из системы' });
};

module.exports = {
  getUsers,
  getUser,
  getMe,
  createUser,
  updateProfile,
  updateProfileAvatar,
  login,
  signOut,
};
