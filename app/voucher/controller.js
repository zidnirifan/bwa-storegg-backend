const path = require('path');
const fs = require('fs');
const Voucher = require('./model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const config = require('../../config');

module.exports = {
  index: async (req, res) => {
    const { name } = req.session.user;
    const title = 'Voucher | StoreGG';

    const vouchers = await Voucher.find()
      .populate('category')
      .populate('nominals');

    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };

    res.render('admin/voucher/view_voucher', { vouchers, alert, title, name });
  },
  viewCreate: async (req, res) => {
    try {
      const { name } = req.session.user;
      const title = 'Tambah voucher | StoreGG';
      const categories = await Category.find();
      const nominals = await Nominal.find();

      res.render('admin/voucher/create', { categories, nominals, name, title });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  actionCreate: async (req, res) => {
    try {
      const { name, category, nominals } = req.body;

      if (req.file) {
        const tmpPath = req.file.path;
        const originalExt =
          req.file.originalname.split('.')[
            req.file.originalname.split('.').length - 1
          ];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);
        src.on('end', async () => {
          try {
            const voucher = new Voucher({
              name,
              category,
              nominals,
              thumbnail: filename,
            });
            await voucher.save();

            req.flash('alertMessage', 'Berhasil tambah voucher');
            req.flash('alertStatus', 'success');

            res.redirect('/voucher');
          } catch (err) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
          }
        });
      } else {
        const voucher = new Voucher({
          name,
          category,
          nominals,
        });
        await voucher.save();

        req.flash('alertMessage', 'Berhasil tambah voucher');
        req.flash('alertStatus', 'success');

        res.redirect('/voucher');
      }
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  viewEdit: async (req, res) => {
    try {
      const { name } = req.session.user;
      const title = 'Edit voucher | StoreGG';
      const { id } = req.params;

      const categories = await Category.find();
      const nominals = await Nominal.find();
      const voucher = await Voucher.findOne({ _id: id })
        .populate('category')
        .populate('nominals');

      res.render('admin/voucher/edit', {
        voucher,
        categories,
        nominals,
        title,
        name,
      });
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  actionEdit: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, category, nominals } = req.body;

      if (req.file) {
        const tmpPath = req.file.path;
        const originalExt =
          req.file.originalname.split('.')[
            req.file.originalname.split('.').length - 1
          ];
        const filename = `${req.file.filename}.${originalExt}`;
        const targetPath = path.resolve(
          config.rootPath,
          `public/uploads/${filename}`
        );

        const src = fs.createReadStream(tmpPath);
        const dest = fs.createWriteStream(targetPath);

        src.pipe(dest);
        src.on('end', async () => {
          try {
            const voucher = await Voucher.findOne({ _id: id });
            const currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

            if (fs.existsSync(currentImage)) {
              fs.unlinkSync(currentImage);
            }

            await Voucher.findOneAndUpdate(
              { _id: id },
              { name, category, nominals, thumbnail: filename }
            );

            req.flash('alertMessage', 'Berhasil tambah voucher');
            req.flash('alertStatus', 'success');

            res.redirect('/voucher');
          } catch (err) {
            req.flash('alertMessage', err.message);
            req.flash('alertStatus', 'danger');
            res.redirect('/voucher');
          }
        });
      } else {
        await Voucher.findOneAndUpdate(
          { _id: id },
          { name, category, nominals }
        );

        req.flash('alertMessage', 'Berhasil ubah voucher');
        req.flash('alertStatus', 'success');

        res.redirect('/voucher');
      }
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.params;

      const voucher = await Voucher.findOneAndRemove({ _id: id });

      const currentImage = `${config.rootPath}/public/uploads/${voucher.thumbnail}`;

      if (fs.existsSync(currentImage)) {
        fs.unlinkSync(currentImage);
      }

      req.flash('alertMessage', 'Berhasil hapus voucher');
      req.flash('alertStatus', 'success');
      res.redirect('/voucher');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
  actionStatus: async (req, res) => {
    try {
      const { id } = req.params;
      let { status } = await Voucher.findOne({ _id: id });

      status = status === 'Y' ? 'N' : 'Y';

      await Voucher.findOneAndUpdate({ _id: id }, { status });
      req.flash(
        'alertMessage',
        `Berhasil ${status === 'Y' ? 'aktifkan' : 'matikan'} voucher`
      );
      req.flash('alertStatus', 'success');

      res.redirect('/voucher');
    } catch (err) {
      req.flash('alertMessage', err.message);
      req.flash('alertStatus', 'danger');
      res.redirect('/voucher');
    }
  },
};
