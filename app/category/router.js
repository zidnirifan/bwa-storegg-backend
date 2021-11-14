const express = require('express');
const {
  index,
  viewCreate,
  actionCreate,
  viewEdit,
  actionEdit,
} = require('./controller');

const router = express.Router();

/* GET home page. */
router.get('/', index);
router.get('/create', viewCreate);
router.post('/create', actionCreate);
router.get('/edit/:id', viewEdit);
router.put('/edit/:id', actionEdit);

module.exports = router;
