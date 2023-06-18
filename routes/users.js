const router = require('express').Router();

// Проверка на валидность
const {
  getUserByIdJoi,
  updateUserProfileJoi,
} = require('../middlewares/celebrate');

// Контроллеры для обработки роутов
const {
  getMyUser,
  updateMyUserProfile,
} = require('../controllers/users');

router.get('/users/me', getMyUser, getUserByIdJoi);
router.patch('/users/me', updateMyUserProfile, updateUserProfileJoi);

module.exports = router;
