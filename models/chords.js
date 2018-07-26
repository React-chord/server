const mongoose = require('mongoose');

const { Schema } = mongoose;

const chordSchema = Schema(
  {
    chord: { type: String, require: true },
    imageurl: { type: String, require: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Chord', chordSchema);
