const Category = require('./model');

module.exports = {
  index: async (req, res) => {
    const categories = await Category.find();
    res.render('admin/category/view_category', { categories });
  },
  viewCreate: async (req, res) => {
    try {
      res.render('admin/category/create');
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async ({ body }, res) => {
    try {
      const { name } = body;

      const category = await Category({ name });
      await category.save();
      res.redirect('/category');
    } catch (err) {
      console.log(err);
    }
  },
  viewEdit: async ({ params }, res) => {
    try {
      const { id } = params;

      const category = await Category.findOne({ _id: id });

      res.render('admin/category/edit', { category });
    } catch (err) {
      console.log(err);
    }
  },
  actionEdit: async ({ params, body }, res) => {
    try {
      const { id } = params;
      const { name } = body;

      await Category.findOneAndUpdate({ _id: id }, { name });
      res.redirect('/category');
    } catch (err) {
      console.log(err);
    }
  },
};
