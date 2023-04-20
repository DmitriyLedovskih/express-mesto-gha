const User = require('../models/user');
const {
  INTERNAL_SERVER_ERROR_STATUS,
  BAD_REQUEST_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
  CREATE_STATUS,
} = require('../utils/constantStatusCode');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' }));
};

const getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((users) => {
      if (!users) {
        res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Пользователь по указанному ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((users) => res.status(CREATE_STATUS).send({ data: users }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateProfile = (req, res) => {
  const updateData = req.body;
  User.findByIdAndUpdate(req.user._id, updateData)
    .then((users) => {
      if (!users) {
        res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Пользователь по указанному ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
      }
    });
};

const updateProfileAvatar = (req, res) => {
  const updateData = req.body;
  User.findByIdAndUpdate(req.user._id, updateData)
    .then((users) => {
      if (!users) {
        res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: users });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Переданы некорректные данные' });
      } else if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Пользователь по указанному ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateProfileAvatar,
};
