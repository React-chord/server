const Music = require('../models/musics');

module.exports = {
  retrieveMusics: (req, res) => {
    Music.find()
      .sort({ createdAt: -1 })
      .then((musics) => {
        res.status(200).json({ message: 'retrieve musics success', musics });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  },
  getMusicsByUserId: (req, res) => {
    const userId = req.user.id;
    Music.find({ userId })
      .sort({ createdAt: -1 })
      .then((music) => {
        res.status(200).json({ message: 'retrieve musics by user success', data: music });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  },
  getMusicsById: (req, res) => {
    const { id } = req.params;
    Music.findById({ _id: id })
      .then((music) => {
        res.status(200).json({ message: 'fetch music success', music });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  addMusics: (req, res) => {
    const newMusic = {
      title: req.body.title,
      content: req.body.artist,
      chords: req.body.chords,
      tempo: req.body.tempo,
    };

    const musicNew = new Music(newMusic);
    musicNew
      .save()
      .then((music) => {
        res.status(201).json({ message: 'create musics success', data: music });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  updateMusic: (req, res) => {
    const { id } = req.params;
    const music = {
      title: req.body.title,
      content: req.body.artist,
      chords: req.body.chords,
      tempo: req.body.tempo,
    };

    Music.findByIdAndUpdate(
      { _id: id },
      {
        $set: music,
      },
    )
      .then((result) => {
        res.status(200).json({ message: 'update music success', data: result });
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
      .then(() => {
        res.status(200).json({ message: 'delete music success', data: null });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
};
