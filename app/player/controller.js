const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
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
        category: resVoucher._doc.category._id,
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
  history: async (req, res) => {
    try {
      const { status = '' } = req.query;
      let criteria = {};

      if (status.length) {
        criteria = { status: { $regex: `${status}`, $options: 'i' } };
      }

      if (req.playerId) {
        criteria = { ...criteria, player: req.playerId };
      }

      const histories = await Transaction.find(criteria).select(
        'historyVoucherTopup value category status'
      );

      const total = histories
        .map((e) => e.value)
        .reduce((accumulator, curr) => accumulator + curr);

      return res.json({
        data: histories,
        total,
      });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  historyDetail: async (req, res) => {
    try {
      const { id: _id } = req.params;

      const history = await Transaction.findOne({ _id });

      if (!history)
        return res.status(404).json({ message: 'Transaksi tidak ditemukan' });

      return res.json({ data: history });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  dashboard: async (req, res) => {
    try {
      const count = await Transaction.aggregate([
        { $match: { player: mongoose.Types.ObjectId(req.playerId) } },
        {
          $group: {
            _id: '$category',
            name: { $first: '$historyVoucherTopup.category' },
            value: { $sum: '$value' },
          },
        },
      ]);

      const histories = await Transaction.find({ player: req.playerId }).sort({
        updatedAt: -1,
      });

      return res.json({ data: histories, count });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  profile: async (req, res) => {
    try {
      const player = await Player.findOne({ _id: req.playerId }).select(
        '_id username email name avatar phoneNumber'
      );

      return res.json({ data: player });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
  // eslint-disable-next-line consistent-return
  editProfile: async (req, res) => {
    try {
      const { name = '', phoneNumber = '' } = req.body;
      const payload = {};

      if (name.length) payload.name = name;
      if (phoneNumber.length) payload.phoneNumber = phoneNumber;

      if (req.file) {
        const tmpPath = req.file.path;
        const originalExt =
          req.file.originalname.split('.')[
            req.file.originalname.split('.').length - 1
          ];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);
        src.on('end', async () => {
          await Player.findOneAndUpdate(
            { _id: req.playerId },
            { ...payload, avatar: filename },
            {
              new: true,
              runValidators: true,
            }
          );

          return res
            .status(201)
            .json({ message: 'Berhasil memperbarui profile' });
        });
      } else {
        await Player.findOneAndUpdate({ _id: req.playerId }, payload, {
          new: true,
          runValidators: true,
        });

        return res.json({
          message: 'Berhasil memperbarui profile',
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};
