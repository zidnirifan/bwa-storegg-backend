const { Schema, model } = require('mongoose');

const bankSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama pemilik harus diisi'],
  },
  bankName: {
    type: String,
    required: [true, 'Nama bank harus diisi'],
  },
  accountNumber: {
    type: Number,
    required: [true, 'Nomor rekening harus diisi'],
  },
});

module.exports = model('Bank', bankSchema);
