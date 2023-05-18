const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  getUsers,
  getUser,
  updateProfile,
  updateProfileAvatar,
  getMe,
} = require('../controllers/users');
const { regex } = require('../utils/constants');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);

router.get('/me', auth, getMe);

router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().hex().length(24),
  }),
}), getUser);

router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), updateProfile);

router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(regex).required(),
  }),
}), updateProfileAvatar);

module.exports = router;
