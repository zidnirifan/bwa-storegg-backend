const Category = require('./model');

module.exports = {
  index: async (req, res) => {
    res.render('admin/category/view_category');
  },
  viewCreate: async (req, res) => {
    try {
      res.render('admin/category/create');
    } catch (err) {
      console.log(err);
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name } = req.body;
      console.log(name);
      console.log(req.body);

      const category = await Category({ name });
      await category.save();
      res.redirect('/category');
    } catch (err) {
      console.log(err);
    }
  },
};
