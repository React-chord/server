const router = require('express').Router()

const {practiceAddMany} = require('../controllers/coursesController')

router.post('/practice/addmany', practiceAddMany)

module.exports = router