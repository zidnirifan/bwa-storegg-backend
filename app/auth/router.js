const express = require('express');
const multer = require('multer');
const os = require('os');
const { signup } = require('./controller');

const router = express.Router();

router.post('/signup', multer({ dest: os.tmpdir() }).single('avatar'), signup);

module.exports = router;
