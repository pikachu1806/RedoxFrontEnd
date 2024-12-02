const mongoose = require('mongoose');
const crypto = require('crypto');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    sectionId: {
        type: String,
        required: true,
        trim: true
    },

    data: [
        {
            accessCode: {
                type: String,
                trim: true
            },
            level1Scores: {
                type: [Number],
                default: [],
                validate: [arrayLimit, 'You can only store up to 5 scores for level 1']
            },
            level2Scores: {
                type: [Number],
                default: [],
                validate: [arrayLimit, 'You can only store up to 5 scores for level 2']
            },
            attemptedDate: {
                type: Date, 
                trim: true
            }
        }  
    ]
});


function arrayLimit(val) {
    return val.length <= 5;
}

studentSchema.methods.generateAccessCode = function() {
    return crypto.randomBytes(8).toString('hex');
};

module.exports = mongoose.model('Student', studentSchema);
