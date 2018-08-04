const express = require('express');

const router = express.Router();
const chordsController = require('../controllers/chordsController');
const images = require('../helpers/upload');
const auth = require('../helpers/auth');

router.get('/', chordsController.retrieveChords);
router.get('/:name', chordsController.getChordsByName);
router.post(
  '/add',
  auth,
  images.multer.single('image'),
  images.sendUploadToGCS,
  chordsController.addChords,
);
router.put(
  '/update/:id',
  auth,
  images.multer.single('image'),
  images.sendUploadToGCS,
  chordsController.updateChord,
);
router.delete('/delete/:id', chordsController.deleteChord);

module.exports = router;
