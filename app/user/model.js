const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
    },
    name: {
      type: String,
      required: [true, 'Nama harus diisi'],
    },
    password: {
      type: String,
      required: [true, 'Kata sandi harus diisi'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'admin',
    },
    status: {
      type: String,
      enum: ['Y', 'N'],
      default: 'Y',
    },
    phoneNumber: {
      type: String,
      required: [true, 'Nomor HP harus diisi'],
    },
  },
  { timestamps: true }
);

module.exports = model('User', userSchema);
