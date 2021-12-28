const { Router } = require('express');
const {
  landingPage,
  detailPage,
  category,
  checkout,
  history,
} = require('./controller');
const { isLoginPlayer } = require('../middleware/auth');

const router = Router();

router.get('/landingPage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/categories', category);
router.post('/checkout', isLoginPlayer, checkout);
router.get('/histories', isLoginPlayer, history);

module.exports = router;
