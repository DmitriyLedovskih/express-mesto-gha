const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateProfileAvatar,
} = require('../controllers/users');

router.get('/users', getUsers);

router.get('/users/:userId', getUser);

router.post('/users', createUser);

router.patch('/users/me', updateProfile);

router.patch('/users/me/avatar', updateProfileAvatar);

module.exports = router;
