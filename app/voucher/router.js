const express = require('express');
const multer = require('multer');
const os = require('os');
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
  actionDelete,
  actionStatus,
} = require('./controller');
const { isLogin } = require('../middleware/auth');

const router = express.Router();

router.use(isLogin);
router.get('/', index);
router.get('/create', viewCreate);
router.post(
  '/create',
  multer({ dest: os.tmpdir() }).single('image'),
  actionCreate
);
router.get('/edit/:id', viewEdit);
router.put(
  '/edit/:id',
  multer({ dest: os.tmpdir() }).single('image'),
  actionEdit
);
router.delete('/delete/:id', actionDelete);
router.put('/status/:id', actionStatus);

module.exports = router;
