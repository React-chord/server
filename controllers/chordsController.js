const Chord = require('../models/chords');

module.exports = {
  retrieveChords: (req, res) => {
    Chord.find()
      .sort({ createdAt: -1 })
      .then((chords) => {
        res.status(200).json({ message: 'retrieve chords success', chords });
      })
      .catch((err) => {
        res.status(500).json({ error: err });
      });
  },
  getChordsByName: (req, res) => {
    const { name } = req.params;
    Chord.findOne({ chord: name })
      .then((chord) => {
        res.status(200).json({ message: 'fetch chord success', chord });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  addChords: (req, res) => {
    const newChord = {
      chord: req.body.chord,
    };

    // if req.file undefined let skip the image updated
    if (req.file && req.file.cloudStoragePublicUrl) {
      newChord.imageUrl = req.file.cloudStoragePublicUrl;
    } else {
      newChord.imageUrl = null;
    }

    console.log(newChord);

    const chord = new Chord(newChord);
    chord
      .save()
      .then((result) => {
        res.status(201).json({ message: 'create chord success', data: result });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  updateChord: (req, res) => {
    const { id } = req.params;
    const chord = {
      chord: req.body.chord,
    };
    // if req.file undefined let skip the image updated
    if (req.file && req.file.cloudStoragePublicUrl) {
      chord.imageUrl = req.file.cloudStoragePublicUrl;
    }

    Chord.findByIdAndUpdate(
      { _id: id },
      {
        $set: chord,
      },
    )
      .then((result) => {
        res.status(200).json({ message: 'update chord success', data: result });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
  deleteChord: (req, res) => {
    const { id } = req.params;
    Chord.findByIdAndRemove({
      _id: id,
    })
      .then(() => {
        res.status(200).json({ message: 'delete chord success', data: null });
      })
      .catch((err) => {
        res.status(400).json({ error: err });
      });
  },
};
