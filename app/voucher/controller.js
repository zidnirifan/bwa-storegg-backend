const path = require('path');
const fs = require('fs');
const Voucher = require('./model');
const Category = require('../category/model');
const Nominal = require('../nominal/model');
const config = require('../../config');

module.exports = {
  index: async (req, res) => {
    const vouchers = await Voucher.find()
      .populate('category')
      .populate('nominals');

    const alertMessage = req.flash('alertMessage');
    const alertStatus = req.flash('alertStatus');
    const alert = { message: alertMessage, status: alertStatus };

    res.render('admin/voucher/view_voucher', { vouchers, alert });
  },
  viewCreate: async (req, res) => {
    try {
      const categories = await Category.find();
      const nominals = await Nominal.find();

      res.render('admin/voucher/create', { categories, nominals });
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
  // viewEdit: async (req, res) => {
  //   try {
  //     const { id } = req.params;

  //     const nominal = await Nominal.findOne({ _id: id });

  //     res.render('admin/nominal/edit', { nominal });
  //   } catch (err) {
  //     req.flash('alertMessage', err.message);
  //     req.flash('alertStatus', 'danger');
  //     res.redirect('/nominal');
  //   }
  // },
  // actionEdit: async (req, res) => {
  //   try {
  //     const { id } = req.params;
  //     const { coinName, coinQuantity, price } = req.body;

  //     await Nominal.findOneAndUpdate(
  //       { _id: id },
  //       { coinName, coinQuantity, price }
  //     );

  //     req.flash('alertMessage', 'Berhasil ubah nominal');
  //     req.flash('alertStatus', 'success');

  //     res.redirect('/nominal');
  //   } catch (err) {
  //     req.flash('alertMessage', err.message);
  //     req.flash('alertStatus', 'danger');
  //     res.redirect('/nominal');
  //   }
  // },
  // actionDelete: async (req, res) => {
  //   try {
  //     const { id } = req.params;

  //     await Nominal.findOneAndRemove({ _id: id });

  //     req.flash('alertMessage', 'Berhasil hapus nominal');
  //     req.flash('alertStatus', 'success');

  //     res.redirect('/nominal');
  //   } catch (err) {
  //     req.flash('alertMessage', err.message);
  //     req.flash('alertStatus', 'danger');
  //     res.redirect('/nominal');
  //   }
  // },
};
