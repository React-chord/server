const mongoose = require('mongoose');

const musicSeed = [
  {
    _id: new mongoose.mongo.ObjectId(),
    title: 'oasis',
    artis: 'wonderwall',
  },
];
module.exports = { musicSeed };
