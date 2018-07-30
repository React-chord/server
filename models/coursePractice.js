const mongoose = require("mongoose");

const { Schema } = mongoose;

const practiceSchema = new Schema({
  note: String
})

module.exports = mongoose.model('coursePractice', practiceSchema)