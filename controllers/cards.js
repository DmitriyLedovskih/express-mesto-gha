const Card = require('../models/card');
const {
  INTERNAL_SERVER_ERROR_STATUS,
  BAD_REQUEST_ERROR_STATUS,
  NOT_FOUND_ERROR_STATUS,
  CREATE_STATUS,
} = require('../utils/constantStatusCode');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => {
      res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((cards) => res.status(CREATE_STATUS).send({ data: cards }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
      }
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((cards) => {
      if (!cards) {
        res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'Карточка не найден' });
        return;
      }
      res.send({ data: cards });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Пользователь по указанному ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Произошла ошибка' });
      }
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Пользователь по указанному ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
      }
    });
};

const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(NOT_FOUND_ERROR_STATUS).send({ message: 'Карточка не найдена' });
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST_ERROR_STATUS).send({ message: 'Пользователь по указанному ID не найден' });
      } else {
        res.status(INTERNAL_SERVER_ERROR_STATUS).send({ message: 'Ошибка сервера' });
      }
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
