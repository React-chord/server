const express = require('express');

const router = express.Router();
const musicsController = require('../controllers/musicsController');
const auth = require('../helpers/auth');

router.get('/', musicsController.retrieveMusics);
router.get('/:id', auth, musicsController.getMusicsById);
router.post('/add', auth, musicsController.addMusics);
router.put('/update/:id', auth, musicsController.updateMusic);
router.delete('/delete/:id', auth, musicsController.deleteMusic);

module.exports = router;
