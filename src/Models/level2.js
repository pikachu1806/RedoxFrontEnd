const mongoose = require('mongoose');

const level2Schema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: false,
    unique: true,
    trim: true,
    index: true
  },
  question: {
    type: String,
    required: true,
    trim: true
  },
  oxidized: {
    type: String,
    required: true,
    trim: true
  },
  reduced: {
    type: String,
    required: true,
    trim: true
  }
});


level2Schema.pre('save', async function(next) {
    if (!this.questionNumber) {
        const lastQuestion = await this.constructor.findOne().sort('-questionNumber');
        this.questionNumber = lastQuestion ? lastQuestion.questionNumber + 1 : 1;
    }
    next();
});

const Level2 = mongoose.model('Level2', level2Schema);

module.exports = Level2;
