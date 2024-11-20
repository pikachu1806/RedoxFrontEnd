const express = require('express');
const router = express.Router();
const Student = require('./Models/studentsAccess.js');

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

module.exports = router;
