/* eslint-disable func-names */
const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');

const HASH_ROUND = 10;

const playerSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Email harus diisi'],
      unique: true,
    },
    name: {
      type: String,
      minlength: [3, 'Panjang nama harus antara 3-225 karakter'],
      maxlength: [255, 'Panjang nama harus antara 3-225 karakter'],
      required: [true, 'Nama harus diisi'],
    },
    password: {
      type: String,
      required: [true, 'Kata sandi harus diisi'],
    },
    role: {
      type: String,
      enum: ['admin', 'user'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['Y', 'N'],
      default: 'Y',
    },
    phoneNumber: {
      type: Number,
      minlength: [9, 'Panjang nomor HP harus antara 9-14 karakter'],
      maxlength: [14, 'Panjang nomor HP harus antara 9-14 karakter'],
      required: [true, 'Nomor HP harus diisi'],
    },
    avatar: {
      type: String,
    },
    username: {
      type: String,
      minlength: [3, 'Panjang username harus antara 3-225 karakter'],
      maxlength: [255, 'Panjang username harus antara 3-225 karakter'],
      required: [true, 'Username harus diisi'],
    },
    favorite: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
    },
  },
  { timestamps: true }
);

playerSchema.path('email').validate(
  async function (value) {
    const count = await this.model('Player').countDocuments({ email: value });
    return !count;
  },
  (attr) => `${attr.value} sudah terdaftar`
);

playerSchema.path('username').validate(
  async function (value) {
    const count = await this.model('Player').countDocuments({
      username: value,
    });
    return !count;
  },
  (attr) => `${attr.value} sudah digunakan`
);

playerSchema.pre('save', async function (next) {
  this.password = await bcrypt.hash(this.password, HASH_ROUND);
  next();
});

module.exports = model('Player', playerSchema);
