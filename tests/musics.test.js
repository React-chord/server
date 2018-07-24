const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');

const app = require('../app');
const Music = require('../models/musics');
const { musicSeed } = require('../tests/seed/seed');

chai.use(chaiHttp);

// remove and create musics
beforeEach(async function () {
  this.timeout(5000);
  await Music.deleteMany({});
  await new Music(musicSeed[0]).save();
});

describe('POST CREATE MUSIC', () => {
  it('should be create new musics', (done) => {
    const title = 'example title';
    const artis = 'example artis';
    const chords = ['A', 'B'];
    const tempo = 120;
    chai
      .request(app)
      .post('/musics/add')
      .send({
        title,
        artis,
        chords,
        tempo,
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res).to.be.json();
        expect(res.body).have.property('message');
        expect(res.body).have.property('data');
        expect(res.body.message).to.be.a('string');
        expect(res.body.data).to.be.an('object');
        Music.find({ artis })
          .then((musics) => {
            expect(musics.length).toBe(1);
            expect(musics[0].title).toBe(title);
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
        expect(res).to.be.json();
        expect(res.body).have.property('message');
        expect(res.body).have.property('musics');
        expect(res.body.musics).to.be.an('array');
        expect(res.body.message).to.be.a('string');
        expect(res.body.musics[0]).have.property('title');
        expect(res.body.musics[0]).have.property('artis');
        expect(res.body.musics[0]).have.property('chords');
        expect(res.body.musics[0].chords).to.be.an('array');
        done();
      });
  });
});

describe('GET /musics/:id', () => {
  it('should get music by id', (done) => {
    chai
      .request(app)
      .get(`/musics/${musicOne[0]._id.toHexString()}`)
      .end((err, res) => {
        console.log(res.body);
        expect(res).to.have.status(200);
        expect(res).to.be.json();
        expect(res.body).have.property('message');
        expect(res.body).have.property('music');
        expect(res.body.message).to.be.a('string');
        expect(res.body.music).have.property('title');
        expect(res.body.music).have.property('artis');
        expect(res.body.music).have.property('chords');
        expect(res.body.music.chords).to.be.an('array');
        done();
      });
  });
});
