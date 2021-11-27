const express = require('express');
const { index, actionLogin } = require('./controller');

const router = express.Router();

/* GET home page. */
router.get('/', index);
router.post('/', actionLogin);

module.exports = router;
