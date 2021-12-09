const { Router } = require('express');
const { landingPage, detailPage } = require('./controller');

const router = Router();

router.get('/landingPage', landingPage);
router.get('/:id/detail', detailPage);

module.exports = router;
