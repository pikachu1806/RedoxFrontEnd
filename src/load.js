const mongoose = require('mongoose');
const fs = require('fs');

mongoose.connect('mongodb://127.0.0.1:27017/Redox', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

const Level1 = require("./Models/level1.js")
const Level2 = require("./Models/level2.js")

var level1Data = {
	"1": {
	  "compound": "LiOH",
	  "correct": "Li = +1, H = +1, O = -2",
	  "incorrect1": "Li = -1, H = -1, O = -1",
	  "incorrect2": "Li = +2, H = +2, O = +1",
	  "incorrect3": "Li = -2, H = -2, O = -3"
	},
	
	"2": {
	  "compound": "NO₃⁻",
	  "correct": "O = -2, N = +5",
	  "incorrect1": "O = +2, N = -3",
	  "incorrect2": "O = -1, N = +1",
	  "incorrect3": "O = +3, N = -2"
	},
	
	"3": {
	  "compound": "SO₂",
	  "correct": "O = -2, S = +4",
	  "incorrect1": "O = +1, S = -1",
	  "incorrect2": "O = -3, S = +3",
	  "incorrect3": "O = -1, S = +2"
	},
	
	"4": {
	  "compound": "H₂O",
	  "correct": "O = -2, H = +1",
	  "incorrect1": "O = +2, H = -1",
	  "incorrect2": "O = -2, H = +2",
	  "incorrect3": "O = +1, H = -2"
	},
	
	"5": {
	  "compound": "S₂O₃²⁻",
	  "correct": "O = -2, S = +1",
	  "incorrect1": "O = +2, S = -1",
	  "incorrect2": "O = +1, S = -2",
	  "incorrect3": "O = -3, S = +1"
	},
	
	"6": {
	  "compound": "MnO₄⁻",
	  "correct": "O = -2, Mn = +7",
	  "incorrect1": "O = +4, Mn = -3",
	  "incorrect2": "O = -1, Mn = +6",
	  "incorrect3": "O = +2, Mn = -7"
	},
	
	"7": {
	  "compound": "CO₂",
	  "correct": "O = -2, C = +4",
	  "incorrect1": "O = +2, C = -4",
	  "incorrect2": "O = +1, C = -2",
	  "incorrect3": "O = -2, C = +3"
	},
	
	"8": {
	  "compound": "C",
	  "correct": "C = 0",
	  "incorrect1": "C = +1",
	  "incorrect2": "C = -1",
	  "incorrect3": "C = +2"
	},
	
	"9": {
	  "compound": "Fe",
	  "correct": "Fe = 0",
	  "incorrect1": "Fe = -1",
	  "incorrect2": "Fe = +2",
	  "incorrect3": "Fe = +4"
	},
	
	"10": {
	  "compound": "NO",
	  "correct": "O = -2, N = +2",
	  "incorrect1": "O = +2, N = -2",
	  "incorrect2": "O = +1, N = -2",
	  "incorrect3": "O = +2, N = -1"
	},
	
	"11": {
	  "compound": "NO₂",
	  "correct": "O = -2, N = +4",
	  "incorrect1": "O = +2, N = -4",
	  "incorrect2": "O = +2, N = -1",
	  "incorrect3": "O = -2, N = +2"
	},
	
	"12": {
	  "compound": "SCl₂",
	  "correct": "Cl = -1, S = +2",
	  "incorrect1": "Cl = +2, S = -1",
	  "incorrect2": "Cl = +1, S = -2",
	  "incorrect3": "Cl = -1, S = +4"
	},
	
	"13": {
	  "compound": "H₂S₂O₇",
	  "correct": "H = +1, O = -2, S = +6",
	  "incorrect1": "H = +1, O = +2, S = -6",
	  "incorrect2": "H = -2, O = +1, S = +6",
	  "incorrect3": "H = +6, O = -2, S = +1"
	},
	
	"14": {
	  "compound": "F⁻",
	  "correct": "F = -1",
	  "incorrect1": "F = +1",
	  "incorrect2": "F = -2",
	  "incorrect3": "F = 0"
	},
	
	"15": {
	  "compound": "H₂S",
	  "correct": "H = +1, S = -2",
	  "incorrect1": "H = -1, S = +2",
	  "incorrect2": "H = -2, S = +1",
	  "incorrect3": "H = +2, S = -1"
	},
	
	"16": {
	  "compound": "CrO₄²⁻",
	  "correct": "O = -2, Cr = +6",
	  "incorrect1": "O = +2, Cr = +3",
	  "incorrect2": "O = -3, Cr = -2",
	  "incorrect3": "O = -1, Cr = +5"
	},
	
	"17": {
	  "compound": "S₈",
	  "correct": "S = 0",
	  "incorrect1": "S = +4",
	  "incorrect2": "S = -4",
	  "incorrect3": "S = +8"
	},
	
	"18": {
	  "compound": "Cu",
	  "correct": "Cu = 0",
	  "incorrect1": "Cu = -1",
	  "incorrect2": "Cu = +2",
	  "incorrect3": "Cu = +4"
	},
	
	"19": {
	  "compound": "Zn²⁺",
	  "correct": "Zn = +2",
	  "incorrect1": "Zn = -2",
	  "incorrect2": "Zn = +1",
	  "incorrect3": "Zn = 0"
	},
	
	"20": {
	  "compound": "O₂",
	  "correct": "O = 0",
	  "incorrect1": "O = -1",
	  "incorrect2": "O = +2",
	  "incorrect3": "O = -2"
	},
	
	"21": {
	  "compound": "CrCl₂",
	  "correct": "Cl = -1, Cr = +2",
	  "incorrect1": "Cl = +2, Cr = -1",
	  "incorrect2": "Cl = -2, Cr = +4",
	  "incorrect3": "Cl = -3, Cr = +1"
	},
	
	"22": {
	  "compound": "Na₂CrO₄",
	  "correct": "Na = +1, O = -2, Cr = +6",
	  "incorrect1": "Na = -2, O = +4, Cr = +3",
	  "incorrect2": "Na = +2, O = -1, Cr = -6",
	  "incorrect3": "Na = +3, O = -3, Cr = +4"
	},
	
	"23": {
	  "compound": "K₂Cr₂O₇",
	  "correct": "K = +1, O = -2, Cr = +6",
	  "incorrect1": "K = -2, O = +7, Cr = +2",
	  "incorrect2": "K = +2, O = -1, Cr = -6",
	  "incorrect3": "K = +3, O = -3, Cr = +3"
	},
	
	"24": {
	  "compound": "F₂",
	  "correct": "F = 0",
	  "incorrect1": "F = -2",
	  "incorrect2": "F = +1",
	  "incorrect3": "F = -1"
	}
  }

async function pushLevel1Data() {
    for (const key in level1Data) {
        const question = level1Data[key];
        const newLevel1Entry = new Level1({
            compound: question.compound,
            correct: question.correct,
            incorrect1: question.incorrect1,
            incorrect2: question.incorrect2,
            incorrect3: question.incorrect3
        });

        try {
            await newLevel1Entry.save();
            console.log(`Question ${key} added successfully`);
        } catch (error) {
            console.error(`Error adding question ${key}:`, error);
        }
    }
}

/* pushLevel1Data()
    .then(() => console.log('All data pushed successfully'))
    .catch(err => console.error('Error pushing data:', err))
    .finally(() => mongoose.connection.close()); */


/*	const jsonData = JSON.parse(fs.readFileSync('./src/level2Data.json', 'utf8'));

    // Insert data into the database
    Level2.insertMany(jsonData)
      .then(() => {
        console.log('Data uploaded successfully');
        mongoose.connection.close();
      })
      .catch((error) => {
        console.error('Error uploading data:', error);
        mongoose.connection.close();
    }); */