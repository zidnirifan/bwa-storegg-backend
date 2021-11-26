const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');

    const alert = { message: alertMessage, status: alertStatus };
    const payments = await Payment.find().populate('banks');
    res.render('admin/payment/view_payment', { payments, alert });
  },
  viewCreate: async (req, res) => {
    try {
      const banks = await Bank.find();
      res.render('admin/payment/create', { banks });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { type, banks } = req.body;

      const payment = new Payment({ type, banks });
      await payment.save();

      req.flash('alertMessage', 'Berhasil tambah jenis pembayaran');
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { id } = req.params;

      const payment = await Payment.findOne({ _id: id }).populate('banks');
      const banks = await Bank.find();

      res.render('admin/payment/edit', { payment, banks });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { type, banks } = req.body;

      await Payment.findOneAndUpdate({ _id: id }, { type, banks });

      req.flash('alertMessage', 'Berhasil ubah jenis pembayaran');
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Payment.findOneAndRemove({ _id: id });

      req.flash('alertMessage', 'Berhasil hapus jenis pembayaran');
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
};
