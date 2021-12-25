const path = require('path');
const fs = require('fs');
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
};
