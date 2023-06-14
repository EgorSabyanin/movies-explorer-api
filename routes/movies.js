const router = require('express').Router();

const {
  getMovies,
  createFilm,
  deleteFilm,
} = require('../controllers/movies');

router.get('/movies', getMovies);

router.post('/movies', createFilm);
router.delete('/movies/:id', deleteFilm);

module.exports = router;
