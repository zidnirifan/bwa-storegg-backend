const express = require('express');
const { index, actionLogin, actionLogout } = require('./controller');

const router = express.Router();

/* GET home page. */
router.get('/', index);
router.post('/', actionLogin);
router.get('/logout', actionLogout);

module.exports = router;
