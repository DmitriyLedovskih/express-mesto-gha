const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateProfile,
  updateProfileAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateProfileAvatar);

module.exports = router;
