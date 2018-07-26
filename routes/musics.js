const express = require('express');

const router = express.Router();
// const isAuthorized = require('../middleware/authorization');
// const isAuthenticated = require('../middleware/authentication');
const musicsController = require('../controllers/musicsController');

router.get('/', musicsController.retrieveMusics);
router.get('/byUser', musicsController.getMusicsByUserId);
router.get('/:id', musicsController.getMusicsById);
router.post('/add', musicsController.addMusics);
router.put('/update/:id', musicsController.updateMusic);
router.delete('/delete/:id', musicsController.deleteMusic);

module.exports = router;
