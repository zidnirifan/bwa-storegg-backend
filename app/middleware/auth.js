const jwt = require('jsonwebtoken');
const config = require('../../config');

module.exports = {
  isLogin: (req, res, next) => {
    if (req.session.user === null || req.session.user === undefined) {
      req.flash(
        'alertMessage',
        'Session anda telah habis, silahkan login kembali'
      );
      req.flash('alertStatus', 'danger');
      res.redirect('/');
    } else {
      next();
    }
  },
  isLoginPlayer: async (req, res, next) => {
    if (!req.headers.authorization)
      return res.status(401).json({ message: 'missing authentication' });
    const token = req.headers.authorization.replace('Bearer ', '');

    const { id } = jwt.verify(token, config.jwtKey);
    req.playerId = id;
    return next();
  },
};
