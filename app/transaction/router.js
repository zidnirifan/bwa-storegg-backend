const express = require('express');
const { index, actionStatus } = require('./controller');
const { isLogin } = require('../middleware/auth');

const router = express.Router();

router.use(isLogin);
router.get('/', index);
router.put('/status/:id', actionStatus);

module.exports = router;
