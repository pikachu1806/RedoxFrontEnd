const express = require('express');
const router = express.Router();
const Student = require('../Models/studentsAccess.js');
const level1 = require("../Models/level1.js");
const Level2 = require("../Models/level2.js")

router.post('/register', async (req, res) => {
    try {
        const newStudent = new Student({
            name: req.body.name,
            email: req.body.email,
            sectionId: req.body.sectionId,
        });

        await newStudent.save();

        res.status(201).json({ message : "Student registered successfully", student : newStudent });
    
    } catch (error) {
      if (error.code === 11000) { 
          res.status(400).json({ message : "Email already exists." });
      } else {
        console.log(error)
          res.status(500).json({ message : "Error registering student", error });
      }
    }
});

router.post('/check-access-code', async (req, res) => {
    try {
        console.log("Check access Request -> ", req.body)
        const { accessCode } = req.body;

        const student = await Student.findOne({ 'data.accessCode': accessCode });
        
        if (!student) {
            return res.status(404).json({ error: 'Invalid access code' });
        }

        const dataIndex = student.data.findIndex(d => d.accessCode === accessCode);

        if (dataIndex !== -1) {
            const studentData = student.data[dataIndex];

            // Check if attemptedDate is already set
            if (studentData.attemptedDate) {
                console.log("Already Attempted")
               // return res.status(403).json({ error: 'Access code has already been used' });
            }

            studentData.attemptedDate = new Date();
            await student.save();
            console.log(student)

            res.status(200).send({ message: 'Access code verified and attempted date updated', studentName: student.name, playerId: accessCode });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to verify access code', details: error.message });
    }
});

router.get('/loadQuestions', async (req, res) => {
    try {
        const { level } = req.query; 
        console.log("Selected level - ", level)
        if (level == "1") {
            // Handle Level 1 questions
            const questions = await level1.find().exec();

            if (Array.isArray(questions) && questions.length > 0) {
                const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

                const level1Data = {
                    question: "Assign oxidation numbers to each atom in the following compounds and ions.",
                };

                shuffledQuestions.forEach((question, index) => {
                    level1Data[(index + 1).toString()] = {
                        compound: question.compound,
                        correct: question.correct,
                        incorrect1: question.incorrect1,
                        incorrect2: question.incorrect2,
                        incorrect3: question.incorrect3
                    };
                });

                return res.status(200).json(level1Data);
            } else {
                console.error("Level 1 questions data is not valid.");
                return res.status(400).json({ error: "Invalid Level 1 questions data." });
            }
        } else if (level == "2") {
            // Handle Level 2 questions
            const questions = await Level2.find().exec();

            if (Array.isArray(questions) && questions.length > 0) {
                const shuffledQuestions = questions.sort(() => Math.random() - 0.5);

                const level2Data = {
                    question: "Assign oxidation numbers to the following substances:",
                };

                shuffledQuestions.forEach((question, index) => {
                    level2Data[(index + 1).toString()] = {
                        question: question.question,
                        oxidized: question.oxidized,
                        reduced: question.reduced
                    };
                });

                return res.status(200).json(level2Data);
            } else {
                console.error("Level 2 questions data is not valid.");
                return res.status(400).json({ error: "Invalid Level 2 questions data." });
            }
        } else {
            console.error("Invalid level value provided.");
            return res.status(400).json({ error: "Invalid level value. Please provide level 1 or 2." });
        }
    } catch (error) {
        console.error("Error fetching questions:", error);
        res.status(500).json({ message: "Error fetching questions" });
    }
});

router.put('/updateScore', async (req, res) => {
    try {
        const { accessCode, score, level } = req.body;
        console.log("update score req = ", req.body)

        if (!['level1', 'level2'].includes(level)) {
            return res.status(400).json({ error: 'Invalid level provided' });
        }

        const student = await Student.findOne({ 'data.accessCode': accessCode });

        if (!student) {
            return res.status(404).json({ error: 'Invalid access code' });
        }

        const dataIndex = student.data.findIndex(d => d.accessCode === accessCode);

        if (dataIndex !== -1) {
            const levelField = level === 'level1' ? 'level1Scores' : 'level2Scores';

            if (student.data[dataIndex][levelField].length < 5) {
                student.data[dataIndex][levelField].push(score);
            } else {
                student.data[dataIndex][levelField].shift();
                student.data[dataIndex][levelField].push(score);
            }

            await student.save();
        }

        res.status(200).json({ message: 'Score updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update score', details: error.message });
    }
});


module.exports = router;
