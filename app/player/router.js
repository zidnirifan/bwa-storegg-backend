const { Router } = require('express');
const {
  landingPage,
  detailPage,
  category,
  checkout,
  history,
  historyDetail,
  dashboard,
} = require('./controller');
const { isLoginPlayer } = require('../middleware/auth');

const router = Router();

router.get('/landingPage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/categories', category);
router.post('/checkout', isLoginPlayer, checkout);
router.get('/histories', isLoginPlayer, history);
router.get('/histories/:id', isLoginPlayer, historyDetail);
router.get('/dashboard', isLoginPlayer, dashboard);

module.exports = router;
