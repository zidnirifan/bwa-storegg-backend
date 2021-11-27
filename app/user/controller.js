const bcrypt = require('bcrypt');
const User = require('./model');

module.exports = {
  index: async (req, res) => {
    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };

    res.render('admin/user/view_login', { alert });
  },
  actionLogin: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (user) {
        if (user.status === 'Y') {
          const isMatch = await bcrypt.compare(password, user.password);
          if (isMatch) res.redirect('/dashboard');
          else {
            req.flash('alertMessage', 'Kata sandi salah');
            req.flash('alertStatus', 'danger');
            res.redirect('/');
          }
        } else {
          req.flash('alertMessage', 'Status anda belum aktif');
          req.flash('alertStatus', 'danger');
          res.redirect('/');
        }
      } else {
        req.flash('alertMessage', 'Email yang anda inputkan salah');
        req.flash('alertStatus', 'danger');
        res.redirect('/');
      }
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/');
    }
  },
};
