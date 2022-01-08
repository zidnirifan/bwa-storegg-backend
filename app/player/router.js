const { Router } = require('express');
const multer = require('multer');
const os = require('os');
const {
  landingPage,
  detailPage,
  category,
  checkout,
  history,
  historyDetail,
  dashboard,
  profile,
  editProfile,
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
router.get('/profile', isLoginPlayer, profile);
router.put(
  '/profile',
  isLoginPlayer,
  multer({ dest: os.tmpdir() }).single('avatar'),
  editProfile
);

module.exports = router;
