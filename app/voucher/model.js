const { Schema, model } = require('mongoose');

const voucherSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Nama game harus diisi'],
  },
  status: {
    type: String,
    enum: ['Y', 'N'],
    default: 'Y',
  },
  thumbnail: String,
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  nominals: [{ type: Schema.Types.ObjectId, ref: 'Nominal' }],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
});

module.exports = model('Voucher', voucherSchema);
