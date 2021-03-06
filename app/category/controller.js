const Category = require('./model');

module.exports = {
  index: async (req, res) => {
    const { name } = req.session.user;
    const title = 'Kategori | StoreGG';
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');

    const alert = { message: alertMessage, status: alertStatus };
    const categories = await Category.find();
    res.render('admin/category/view_category', {
      categories,
      alert,
      title,
      name,
    });
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;
      const title = 'Tambah kategori | StoreGG';
      res.render('admin/category/create', { name, title });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;

      const category = new Category({ name });
      await category.save();

      req.flash('alertMessage', 'Berhasil tambah kategory');
      req.flash('alertStatus', 'success');

      res.redirect('/category');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { name } = req.session.user;
      const title = 'Tambah edit | StoreGG';
      const { id } = req.params;

      const category = await Category.findOne({ _id: id });

      res.render('admin/category/edit', { category, name, title });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name } = req.body;

      await Category.findOneAndUpdate({ _id: id }, { name });

      req.flash('alertMessage', 'Berhasil ubah kategory');
      req.flash('alertStatus', 'success');

      res.redirect('/category');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      await Category.findOneAndRemove({ _id: id });

      req.flash('alertMessage', 'Berhasil hapus kategory');
      req.flash('alertStatus', 'success');

      res.redirect('/category');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/category');
    }
  },
};
