const express = require('express');
const { index, viewCreate, actionCreate } = require('./controller');

const router = express.Router();

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);

module.exports = router;
