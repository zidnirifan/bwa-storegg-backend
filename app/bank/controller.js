const Bank = require('./model');

module.exports = {
  index: async (req, res) => {
    const { name } = req.session.user;
    const title = 'Bank | StoreGG';

    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');

    const alert = { message: alertMessage, status: alertStatus };
    const banks = await Bank.find();
    res.render('admin/bank/view_bank', { banks, alert, name, title });
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;
      const title = 'Tambah bank | StoreGG';
      res.render('admin/bank/create', { name, title });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, bankName, accountNumber } = req.body;

      const bank = new Bank({ name, bankName, accountNumber });
      await bank.save();

      req.flash('alertMessage', 'Berhasil tambah bank');
      req.flash('alertStatus', 'success');

      res.redirect('/bank');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { name } = req.session.user;
      const title = 'Edit bank | StoreGG';
      const { id } = req.params;

      const bank = await Bank.findOne({ _id: id });

      res.render('admin/bank/edit', { bank, title, name });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, bankName, accountNumber } = req.body;

      await Bank.findOneAndUpdate(
        { _id: id },
        { name, bankName, accountNumber }
      );

      req.flash('alertMessage', 'Berhasil ubah bank');
      req.flash('alertStatus', 'success');

      res.redirect('/bank');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Bank.findOneAndRemove({ _id: id });

      req.flash('alertMessage', 'Berhasil hapus bank');
      req.flash('alertStatus', 'success');

      res.redirect('/bank');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/bank');
    }
  },
};
