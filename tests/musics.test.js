const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');

const app = require('../app');
const Music = require('../models/musics');
const User = require('../models/user');
const { musicSeed, users, tokens } = require('../tests/seed/seed');

chai.use(chaiHttp);

// remove and create user
beforeEach(function (done) {
  this.timeout(6000);
  User.deleteMany({}).then(async () => {
    await User.findOneOrCreate(users[0]);
    await User.findOneOrCreate(users[1]);
    done();
  });
});

// remove and create musics
beforeEach(async function () {
  await this.timeout(6000);
  await Music.deleteMany({});
  await new Music(musicSeed[0]).save();
});

describe('POST /musics/add', () => {
  it('should be create new musics', (done) => {
    const title = 'example title';
    const artist = 'example artist';
    const chords = ['A', 'B'];
    const tempo = 120;
    chai
      .request(app)
      .post('/musics/add')
      .set('authorization', tokens[0].token)
      .send({
        title,
        artist,
        chords,
        tempo,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).have.property('message');
        expect(res.body).have.property('data');
        expect(res.body.message).to.be.a('string');
        expect(res.body.data).to.be.an('object');
        Music.find({ title })
          .then((musics) => {
            console.log('musics: ', musics);
            expect(musics.length).to.equal(1);
            expect(musics[0].title).to.equal(title);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('GET /musics', () => {
  it('should get all musics', (done) => {
    chai
      .request(app)
      .get('/musics')
      .end((err, res) => {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res.body).have.property('message');
        expect(res.body).have.property('musics');
        expect(res.body.musics).to.be.an('array');
        expect(res.body.message).to.be.a('string');
        expect(res.body.musics[0]).have.property('title');
        expect(res.body.musics[0]).have.property('artist');
        expect(res.body.musics[0]).have.property('chords');
        expect(res.body.musics[0].chords).to.be.an('array');
        done();
      });
  });
});

describe('GET /musics/:id', () => {
  const newId = musicSeed[0]._id.toHexString();
  it('should get music by id', (done) => {
    chai
      .request(app)
      .get(`/musics/${newId}`)
      .set('authorization', tokens[0].token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).have.property('message');
        expect(res.body).have.property('music');
        expect(res.body.message).to.be.a('string');
        expect(res.body.music).have.property('title');
        expect(res.body.music).have.property('artist');
        expect(res.body.music).have.property('chords');
        expect(res.body.music.chords).to.be.an('array');
        done();
      });
  });
});

describe('PUT /musics/update/:id', () => {
  const newId = musicSeed[0]._id.toHexString();
  const title = 'example title';
  const artist = 'example artist';
  const chords = ['A', 'B'];
  const tempo = 120;
  it('should be update music by id', (done) => {
    chai
      .request(app)
      .put(`/musics/update/${newId}`)
      .set('authorization', tokens[0].token)
      .send({
        title,
        artist,
        chords,
        tempo,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).have.property('message');
        expect(res.body).have.property('data');
        expect(res.body.message).to.be.a('string');
        expect(res.body.data).to.be.an('object');
        expect(res.body.data.title).to.be.a('string');
        expect(res.body.data.artist).to.be.a('string');
        done();
      });
  });
});

describe('DELETE /musics/delete/:id', () => {
  const newId = musicSeed[0]._id.toHexString();
  it('should be delete the article', (done) => {
    chai
      .request(app)
      .delete(`/musics/delete/${newId}`)
      .set('authorization', tokens[0].token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).have.property('message');
        expect(res.body).have.property('data');
        expect(res.body.message).to.be.a('string');
        expect(res.body.data).to.be.a('null');
        done();
      });
  });
});

describe('POST /users/register', () => {
  it('should register/create a user', (done) => {
    const fullname = 'example name';
    const email = 'example@example.com';
    const password = 'example123';
    chai
      .request(app)
      .post('/users/register')
      .send({
        fullname,
        email,
        password,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).have.property('message');
        expect(res.body.message).to.be.a('string');
        User.findOne({ email })
          .then((newUser) => {
            expect(newUser).to.exist;
            expect(newUser.email).to.equal(email);
            done();
          })
          .catch(e => done(e));
      });
  });
});

describe('POST /users/login', () => {
  it('should login user and return token', (done) => {
    const { email } = users[1];
    const { password } = users[1];
    console.log('email', email);
    console.log('password', password);
    chai
      .request(app)
      .post('/users/login')
      .send({
        email,
        password,
      })
      .end((err, res) => {
        console.log('res', res.body);
        expect(res).to.have.status(200);
        expect(res.body).have.property('message');
        expect(res.body.token).exist;
        done();
      });
  });
});
