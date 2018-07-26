const mongoose = require('mongoose');

const musicSeed = [
  {
    _id: new mongoose.mongo.ObjectId(),
    title: 'wonderwall',
    artist: 'oasis',
    tempo: 150,
  },
];
module.exports = { musicSeed };
