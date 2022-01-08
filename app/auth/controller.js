const path = require('path');
const fs = require('fs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Player = require('../player/model');
const config = require('../../config');

module.exports = {
  // eslint-disable-next-line consistent-return
  signup: async (req, res, next) => {
    try {
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
            const player = new Player({
              ...req.body,
              avatar: filename,
            });
            await player.save();

            delete player._doc.password;
            return res.status(201).json({ data: player });
          } catch (err) {
            if (err && err.name === 'ValidationError') {
              return res.status(422).json({
                message: err.message,
                fields: err.errors,
              });
            }
            return next(err);
          }
        });
      } else {
        const player = new Player(req.body);
        await player.save();

        delete player._doc.password;
        return res.status(201).json({ data: player });
      }
    } catch (err) {
      if (err && err.name === 'ValidationError') {
        return res.status(422).json({
          message: err.message,
          fields: err.errors,
        });
      }
      return next(err);
    }
  },
  signin: async (req, res) => {
    try {
      const { email, password } = req.body;

      const player = await Player.findOne({ email });

      if (player) {
        const checkPassword = await bcrypt.compare(password, player.password);

        if (checkPassword) {
          const token = jwt.sign(
            {
              id: player._id,
              email: player.email,
            },
            config.jwtKey
          );

          res.json({
            data: { token },
          });
        } else {
          res.status(403).json({
            message: 'password salah',
          });
        }
      } else {
        res.status(404).json({
          message: 'user tidak ditemukan',
        });
      }
    } catch (err) {
      res.status(500).json({ message: 'Internal server error' });
    }
  },
};
