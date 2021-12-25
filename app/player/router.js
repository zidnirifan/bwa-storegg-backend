const { Router } = require('express');
const { landingPage, detailPage, category } = require('./controller');

const router = Router();

router.get('/landingPage', landingPage);
router.get('/:id/detail', detailPage);
router.get('/categories', category);

module.exports = router;
