const mongoose = require('mongoose');
const Music = require('../../models/musics');

const musicSeed = [
  {
    _id: new mongoose.mongo.ObjectId(),
    title: 'wonderwall',
    artist: 'oasis',
    tempo: 150,
  },
];

const populateMusics = async (done) => {
  await Music.remove({});
  await Music.insertMany(musicSeed);
  await done();
};

module.exports = { musicSeed, populateMusics };
