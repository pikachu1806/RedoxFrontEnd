const mongoose = require('mongoose');

const level1Schema = new mongoose.Schema({
  questionNumber: {
    type: Number,
    required: false,
    unique: true,
    trim: true,
    index: true
  },
  compound: {
    type: String,
    required: true,
    trim: true
  },
  correct: {
    type: String,
    required: true,
    trim: true
  },
  incorrect1: {
    type: String,
    required: true,
    trim: true
  },
  incorrect2: {
    type: String,
    required: true,
    trim: true
  },
  incorrect3: {
    type: String,
    required: true,
    trim: true
  }
});

level1Schema.pre('save', async function(next) {
    if (!this.questionNumber) {
        const lastQuestNumb = await this.constructor.findOne().sort('-questionNumber');
        this.questionNumber = lastQuestNumb ? lastQuestNumb.questionNumber + 1 : 1;
    }
    next();
});

const Level1 = mongoose.model('Level1', level1Schema);

module.exports = Level1;