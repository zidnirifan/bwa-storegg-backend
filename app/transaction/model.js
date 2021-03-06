const { Schema, model } = require('mongoose');

const transactionSchema = new Schema(
  {
    historyVoucherTopup: {
      gameName: {
        type: String,
        required: [true, 'Nama game harus diisi'],
      },
      category: {
        type: String,
        required: [true, 'Kategori harus diisi'],
      },
      thumbnail: {
        type: String,
      },
      coinName: {
        type: String,
        required: [true, 'Nama koin harus diisi'],
      },
      coinQuantity: {
        type: String,
        required: [true, 'Jumlah koin harus diisi'],
      },
      price: {
        type: Number,
      },
    },
    historyPayment: {
      name: {
        type: String,
        required: [true, 'Nama pemilik bank harus diisi'],
      },
      type: {
        type: String,
        required: [true, 'Tipe pembayaran harus diisi'],
      },
      bankName: {
        type: String,
        required: [true, 'Nama bank harus diisi'],
      },
      accountNumber: {
        type: Number,
        required: [true, 'Nomor rekening harus diisi'],
      },
    },
    name: {
      type: String,
      minlength: [3, 'Panjang nama harus antara 3-225 karakter'],
      maxlength: [255, 'Panjang nama harus antara 3-225 karakter'],
      required: [true, 'nama harus diisi'],
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
    tax: {
      type: Number,
      default: 0,
    },
    value: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed'],
      default: 'pending',
    },
    player: {
      type: Schema.Types.ObjectId,
      ref: 'Player',
    },
    voucherTopup: {
      type: Schema.Types.ObjectId,
      ref: 'Voucher',
    },
  },
  { timestamps: true }
);

module.exports = model('Transaction', transactionSchema);
