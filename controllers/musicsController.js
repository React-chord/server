const Music = require('../models/musics');

module.exports = {
  retrieveMusics: (req, res) => {
    Music.find()
      .sort({ createdAt: -1 })
      .populate('userId')
      .then((musics) => {
        res.status(200).json({ message: 'retrieve articles success', musics });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  },
  getMusicsByUserId: (req, res) => {
    const userId = req.user.id;
    Music.find({ userId })
      .sort({ createdAt: -1 })
      .populate('userId')
      .then((music) => {
        res.status(200).json({ message: 'retrieve articles by user success', data: music });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  },
  getMusicsById: (req, res) => {
    const { id } = req.params;
    Music.findById({ _id: id })
      .populate('userId')
      .then((music) => {
        res.status(200).json({ message: 'fetch article success', music });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  addMusics: (req, res) => {
    const newMusic = {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    };

    // if req.file undefined let skip the image updated
    if (req.file && req.file.cloudStoragePublicUrl) {
      newMusic.imageUrl = req.file.cloudStoragePublicUrl;
    } else {
      newMusic.imageUrl = null;
    }

    const article = new Music(newMusic);
    article
      .save()
      .then((result) => {
        res.status(201).json({ message: 'create article success', data: result });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  updateMusic: (req, res) => {
    const { id } = req.params;
    const article = {
      title: req.body.title,
      content: req.body.content,
      userId: req.user.id,
    };
    // if req.file undefined let skip the image updated
    if (req.file && req.file.cloudStoragePublicUrl) {
      article.imageUrl = req.file.cloudStoragePublicUrl;
    }

    Music.findByIdAndUpdate(
      { _id: id },
      {
        $set: article,
      },
    )
      .then((result) => {
        res.status(200).json({ message: 'update article success', data: result });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  deleteMusic: (req, res) => {
    const { id } = req.params;
    Music.findByIdAndRemove({
      _id: id,
    })
      .then((result) => {
        res.status(200).json({ message: 'delete article success', data: result });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
};
