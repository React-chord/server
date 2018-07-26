const chai = require('chai');

const { expect } = chai;
const chaiHttp = require('chai-http');

const app = require('../app');
const Music = require('../models/musics');
const { musicSeed } = require('../tests/seed/seed');

chai.use(chaiHttp);

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
        expect(res).to.be.json;
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
      .send({
        title,
        artist,
        chords,
        tempo,
      })
      .end((err, res) => {
        console.log(res.body);
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
