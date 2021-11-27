module.exports = {
  index: async (req, res) => {
    const { name } = req.session.user;
    const title = 'Dashboard | StoreGG';
    res.render('index', { name, title });
  },
};
