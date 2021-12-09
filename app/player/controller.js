const mongoose = require('mongoose');
const Voucher = require('../voucher/model');

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
};
