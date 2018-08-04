const express = require('express');

const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const musicsRouter = require('./routes/musics');
const usersRouter = require('./routes/users.js');
const chordsRouter = require('./routes/chords');
const coursesRouter = require('./routes/courses');

let url = `mongodb://${process.env.DB_USER}:${
  process.env.DB_PASSWORD
}@ds249311.mlab.com:49311/chords-db`;

const port = process.env.PORT || 3000;

if (process.env.NODE_ENV === 'test') {
  url += '-test';
}
mongoose.connect(
  url,
  { useNewUrlParser: true },
  (err) => {
    if (err) throw err;
    console.log(`Successfully connected to database ${process.env.NODE_ENV}`);
  },
);

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/musics', musicsRouter);
app.use('/users', usersRouter);
app.use('/chords', chordsRouter);
app.use('/courses', coursesRouter)

const server = app.listen(port, () => {
  console.log(`server running on port ${port}`);
});

function stop() {
  server.close();
}

module.exports = app;
module.exports.stop = stop;
