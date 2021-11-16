const { Schema, model } = require('mongoose');

const categorySchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama kategori harus diisi'],
  },
});

module.exports = model('Category', categorySchema);
