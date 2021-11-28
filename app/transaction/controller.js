const Transaction = require('./model');

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };
    const { name } = req.session.user;
    const title = 'Transaksi | StoreGG';

    const transactions = await Transaction.find().populate('player');

    res.render('admin/transaction/view_transaction', {
      transactions,
      alert,
      title,
      name,
    });
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.query;

      await Transaction.findByIdAndUpdate({ _id: id }, { status });

      req.flash('alertMessage', 'Berhasil ubah status');
      req.flash('alertStatus', 'success');

      res.redirect('/transaction');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/transaction');
    }
  },
};
