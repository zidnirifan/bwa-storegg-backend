const { Schema, model } = require('mongoose');

const nominalSchema = new Schema(
  {
    coinQuantity: {
      type: Number,
      default: 0,
    },
    coinName: {
      type: String,
      required: [true, 'Nama koin harus diisi'],
    },
    price: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = model('Nominal', nominalSchema);
