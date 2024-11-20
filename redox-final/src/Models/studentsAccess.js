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
            level1Score: {
                type: Number,
                trim: true
            },
            level2Score: {
                type: Number,
                trim: true
            },
            attemptedDate: {
                type: Date, 
                trim: true
            }
        }  
    ]
});


studentSchema.methods.generateAccessCode = function() {
    return crypto.randomBytes(8).toString('hex');
};

module.exports = mongoose.model('Student', studentSchema);
