const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Nama kategori harus diisi'],
  },
});

module.exports = mongoose.model('categories', categorySchema);
