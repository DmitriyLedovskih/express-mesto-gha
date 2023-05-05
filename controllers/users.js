const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  CREATE_STATUS,
} = require('../utils/constantStatusCode');
const NotFoundError = require('../errors/NotFoundError');
const BadRequestError = require('../errors/BadRequestError');
const ConflictError = require('../errors/ConflictError');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному ID не найден'));
      } else {
        next(err);
      }
    });
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
          }
          if (err.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else {
            next(err);
          }
        });
    });
};

const updateProfile = (req, res, next) => {
  const updateData = req.body;
  User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному ID не найден'));
      } else {
        next(err);
      }
    });
};

const updateProfileAvatar = (req, res, next) => {
  const updateData = req.body;
  User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователь не найден');
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (err.name === 'CastError') {
        next(new BadRequestError('Пользователь по указанному ID не найден'));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-key', { expiresIn: '1s' });
      res.cookie('token', token, {
        maxAge: 1,
        httpOnly: true,
      });

      res.send({ token });
    })
    .catch(next);
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateProfileAvatar,
  login,
};
