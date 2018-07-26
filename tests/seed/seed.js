const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Music = require('../../models/musics');

const userOneId = new mongoose.mongo.ObjectId();
const userTwoId = new mongoose.mongo.ObjectId();

const users = [
  {
    _id: userOneId,
    fullname: 'jajang miharjang',
    email: 'jajang@example.com',
    password: 'password1',
  },
  {
    _id: userTwoId,
    name: 'Udin Kaprudin',
    email: 'udin@example.com',
    password: 'udin123',
  },
];

const tokens = [
  {
    token: jwt
      .sign(
        { id: users[0]._id, fullname: users[0].fullname, email: users[0].email },
        process.env.JWT_SECRET,
      )
      .toString(),
  },
];

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

module.exports = {
  musicSeed,
  populateMusics,
  users,
  tokens,
};
