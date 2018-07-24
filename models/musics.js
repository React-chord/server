const mongoose = require('mongoose');

const { Schema } = mongoose;

const musicSchema = Schema(
  {
    title: { type: String, require: true },
    artist: { type: String, require: true },
    chords: { type: [String], require: true },
    tempo: { type: Number, require: true },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Music', musicSchema);
