const express = require('express');
const { index } = require('./controller');

const router = express.Router();

/* GET home page. */
router.get('/', index);

module.exports = router;
