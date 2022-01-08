const express = require('express');
const { index } = require('./controller');
const { isLogin } = require('../middleware/auth');

const router = express.Router();

router.use(isLogin);
router.get('/', index);

module.exports = router;
