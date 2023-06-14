const router = require('express').Router();

// Проверка на валидность
const {
  validateDeleteFilm,
  validateCreateFilm,
} = require('../middlewares/celebrate');

// Контроллеры для обработки роутов
const {
  getMovies,
  createFilm,
  deleteFilm,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', createFilm, validateCreateFilm);
router.delete('/movies/:id', deleteFilm, validateDeleteFilm);

module.exports = router;
