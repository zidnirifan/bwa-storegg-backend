const { Schema, model } = require('mongoose');

const paymentSchema = new Schema({
  type: {
    type: String,
    required: [true, 'Type pembayaran harus diisi'],
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y',
  },
  banks: [
    {
      type: Schema.Types.ObjectId,
      required: 'Bank',
    },
  ],
});

module.exports = model('Payment', paymentSchema);
