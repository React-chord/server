const CoursePractice = require('../models/coursePractice')

module.exports = {
  practiceAddMany: async (req, res) => {
    try {
      let { notes } = req.body
      let notesArr = notes.split(' ').map(note => {
        return note = {note}
      })
      await CoursePractice.insertMany(notesArr)
      res.json({message: 'ok'})
    } catch (error) {
      res.status(500).json({error})
    }
  }
}