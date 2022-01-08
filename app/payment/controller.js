const Payment = require('./model');
const Bank = require('../bank/model');

module.exports = {
  index: async (req, res) => {
    const { name } = req.session.user;
    const title = 'Jenis Pembayaran | StoreGG';

    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');

    const alert = { message: alertMessage, status: alertStatus };
    const payments = await Payment.find().populate('banks');
    res.render('admin/payment/view_payment', { payments, alert, title, name });
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;
      const title = 'Tambah pembayaran | StoreGG';

      const banks = await Bank.find();
      res.render('admin/payment/create', { banks, title, name });
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
      const { name } = req.session.user;
      const title = 'Edit pembayaran | StoreGG';
      const { id } = req.params;

      const payment = await Payment.findOne({ _id: id }).populate('banks');
      const banks = await Bank.find();

      res.render('admin/payment/edit', { payment, banks, name, title });
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
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let { status } = await Payment.findOne({ _id: id });

      status = status === 'Y' ? 'N' : 'Y';

      await Payment.findOneAndUpdate({ _id: id }, { status });
      req.flash(
        'alertMessage',
        `Berhasil ${status === 'Y' ? 'aktifkan' : 'matikan'} pembayaran`
      );
      req.flash('alertStatus', 'success');

      res.redirect('/payment');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/payment');
    }
  },
};
