const mongoose = require('mongoose');
const Voucher = require('../voucher/model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const Payment = require('../payment/model');
const Bank = require('../bank/model');
const Player = require('./model');
const Transaction = require('../transaction/model');
const config = require('../../config');

module.exports = {
  landingPage: async (req, res) => {
    try {
      const vouchers = await Voucher.find()
        .select('_id name status category thumbnail')
        .populate('category');

      res.json({ status: 'success', data: vouchers });
    } catch (err) {
      console.log(err.message);
      res
        .status(500)
        .json({ status: 'fail', message: 'Internal server error' });
    }
  },
  detailPage: async (req, res) => {
    try {
      const { id } = req.params;
      const isIdValid = mongoose.Types.ObjectId.isValid(id);

      if (!isIdValid) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'voucher tidak ditemukan' });
      }

      const voucher = await Voucher.findOne({ _id: id })
        .populate('category')
        .populate('nominals')
        .populate('user', '_id name phoneNumber');

      if (!voucher) {
        return res
          .status(404)
          .json({ status: 'fail', message: 'voucher tidak ditemukan' });
      }

      return res.json({ status: 'success', data: voucher });
    } catch (err) {
      console.log(err.message);
      return res
        .status(500)
        .json({ status: 'fail', message: 'Internal server error' });
    }
  },
  category: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json({ data: categories });
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
  checkout: async (req, res) => {
    try {
      const { nominal, voucher, payment, bank } = req.body;

      const player = await Player.findOne({ _id: req.playerId }).select('name');
      if (!player)
        return res.status(404).json({ message: 'player tidak terdaftar' });

      const resVoucher = await Voucher.findOne({ _id: voucher })
        .select('name category _id thumbnail')
        .populate('category');

      if (!resVoucher)
        return res.status(404).json({ message: 'voucher tidak ditemukan' });

      const resNominal = await Nominal.findOne({ _id: nominal });
      if (!resNominal)
        return res.status(404).json({ message: 'nominal tidak ditemukan' });

      const resPayment = await Payment.findOne({ _id: payment });
      if (!resPayment)
        return res.status(404).json({ message: 'payment tidak ditemukan' });

      const resBank = await Bank.findOne({ _id: bank });
      if (!resBank)
        return res.status(404).json({ message: 'bank game tidak ditemukan' });

      const tax = (config.taxPercentage / 100) * resNominal._doc.price;
      const value = resNominal._doc.price - tax;

      const payload = {
        historyVoucherTopup: {
          gameName: resVoucher._doc.name,
          category: resVoucher._doc.category.name,
          thumbnail: resVoucher._doc.thumbnail,
          coinName: resNominal._doc.coinName,
          coinQuantity: resNominal._doc.coinQuantity,
          price: resNominal._doc.price,
        },
        historyPayment: {
          name: resBank._doc.name,
          type: resPayment._doc.type,
          bankName: resBank._doc.bankName,
          accountNumber: resBank._doc.accountNumber,
        },
        name: player._doc.name,
        tax,
        value,
        player: req.playerId,
        voucherTopup: voucher,
      };

      const transaction = new Transaction(payload);

      await transaction.save();
      return res.status(201).json({ message: 'Berhasil checkout' });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};
