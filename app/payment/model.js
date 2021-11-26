const { Schema, model } = require('mongoose');

const paymentSchema = new Schema(
  {
    type: {
      type: String,
      required: [true, 'Tipe pembayaran harus diisi'],
    },
    status: {
      type: String,
      enum: ['Y', 'N'],
      default: 'Y',
    },
    banks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Bank',
        required: [true, 'Bank harus diisi'],
      },
    ],
  },
  { timestamps: true }
);

module.exports = model('Payment', paymentSchema);
