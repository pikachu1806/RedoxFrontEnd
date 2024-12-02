const express=require("express")
const jwt=require("jsonwebtoken")
const router = new express.Router()
const Jwt_Secret="thisisseceret";
const Model = require("../Models/userModel.js");
const level1 = require("../Models/level1.js");
const Level2 = require("../Models/level2.js")
const studentAccessModel = require("../Models/studentsAccess.js")
const emails = require("../emails.js");
const JWT_SECRET_KEY='redoxsecretkey'

var savedOTPS = {

};

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        const user = await Model.findOne({ _id: decoded._id });

        if (!user) {
            throw new Error();
        }
        console.log("User authenticated")
        req.user = user;
        next();
    } catch (error) {
        res.status(401).send({ error: 'Please authenticate.' });
    }
};

router.post("/login", async (req, res) => {
    try {
        if (req.body) {
            const { email, password } = req.body;
            const login = await Model.findByCredentials(email, password);

            if (!login.firstName) {
                res.status(301).json({ error: login });
                return;
            }

            const token = await login.generateAuthToken();

            res.status(200).json({ response: "Login success", user: login, token });
            return;
        }
    } catch (err) {
        console.log("Error while login ", err);
        res.status(400).send({ error: "Wrong password or email" });
    }
});


router.post("/register", async (req,res) => {
        try{
            if(req.body){
                const user = new Model(req.body);
                await user.save();
                console.log("user ",user)
                if(user){
                   console.log("User account created");
                   res.status(200).send({response: "Account Created", user: user});
                   return 
                }
                res.status(500).send({error: "Failed To create account"});
                return 
            }
        } catch (error){
            console.log("Failed to create account");
            res.status(500).send({error: "Failed to create account"});
        }
})

router.post("/request-otp", async (req,res) => {
    try{
        if(req.body){
                const email = req.body.email
                console.log(email, req.body)
                let randomdigit = Math.floor(100000 + Math.random() * 900000);
                await emails.sendOTP(email, randomdigit)
                savedOTPS[email] = randomdigit;
                setTimeout(() => {
                    delete savedOTPS[`${email}`];
                }, 180000);
                console.log(savedOTPS);
                res.status(200).send({success: `OTP sent - ${email}`})
        }
    } catch(err){
        console.log("Error while login ", err);
        res.send({error: "Wrong password or email"})
    }
})

router.post("/check-otp", async(req,res) => {
    try{
        const {otp, email} = req.body
        if (savedOTPS[email] && savedOTPS[email].toString() === otp.toString()) {
            res.status(200).send({success : "Mail Verified"})
            delete savedOTPS[email];
          } else {
            res.status(300).send({error: "Wrong otp!"})
          }

    } catch (err) {
        console.log("Error in while checking OTP : ",err)
        res.status(500).send({error : "Something went wrong in server!"})
    }
})

router.post("/addQuestion", auth, async (req, res) => {
    try {
        const { compound, correct, incorrect1, incorrect2, incorrect3 } = req.body;

        const newQuestion = new level1({
            compound,
            correct,
            incorrect1,
            incorrect2,
            incorrect3
        });

        await newQuestion.save();

        res.status(201).json({ ok: "Added", message: 'Question added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to add question.' });
    }
});

router.get("/getQuestions", auth, async (req,res) => {
    try {
        const getQuestion = await level1.find();

        if (!getQuestion) {
            return res.status(404).json({ message: 'Questions not found.' });
        }

        res.status(200).json({  ok: "Updated", questions: getQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update question.' });
    }
})

router.put("/questions/:questionNumber", auth, async (req, res) => {
    try {
        console.log(req.body)
        const { compound, correct, incorrect1, incorrect2, incorrect3 } = req.body;
        const questionNumber = req.params.questionNumber;

        const updatedQuestion = await level1.findOneAndUpdate(
            { questionNumber: questionNumber },
            { compound, correct, incorrect1, incorrect2, incorrect3 },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        res.status(200).json({  ok: "Updated", message: 'Question updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update question.' });
    }
});


router.delete("/questions/:questionNumber", auth, async (req, res) => {
    try {
        const questionNumber = req.params.questionNumber;

        const deletedQuestion = await level1.findOneAndDelete({ questionNumber: questionNumber });

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Question not found.' });
        }

        res.status(200).json({ ok: "Deleted", message: 'Question deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to delete question.' });
    }
});


router.post('/addStudents', auth, async (req, res) => {
    try {
        const { name, email, sectionId } = req.body;
        console.log(req.body)
        const newStudent = new studentAccessModel({ name, email, sectionId });
        await newStudent.save();

        res.status(201).json({ message: 'Student added successfully', student: newStudent });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to add student', details: error.message });
    }
});

router.put('/students/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, sectionId } = req.body;

        const updatedStudent = await studentAccessModel.findByIdAndUpdate(
            id,
            { name, email, sectionId },
            { new: true, runValidators: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ message: 'Student updated successfully', student: updatedStudent });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update student', details: error.message });
    }
});

router.delete('/students/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        console.log(id)
        const deletedStudent = await studentAccessModel.findByIdAndDelete({_id: id});

        if (!deletedStudent) {
            return res.status(404).json({ error: 'Student not found' });
        }

        res.status(200).json({ message: 'Student deleted successfully', student: deletedStudent });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to delete student', details: error.message });
    }
});

router.get('/students', auth, async (req, res) => {
    try {
        const students = await studentAccessModel.find();
        res.status(200).json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/generate-access-code', auth, async (req, res) => {
    try {
        const students = await studentAccessModel.find();
        
        // Loop through each student to generate access codes and send emails
        for (const student of students) {
            const hasAccessCode = student.data.some(d => d.accessCode);

            if (!hasAccessCode) {
                const accessCode = student.generateAccessCode();
                student.data.push({ accessCode });
                await student.save();

                // Send access code email
                await emails.sendAccessCode(student.email, accessCode);
            }
        }

        res.status(200).json({ message: 'Access codes generated and sent successfully to students without one.' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Failed to generate access codes', details: error.message });
    }
});


router.post("/addLevel2Question", auth, async (req, res) => {
    try {
        const { question, oxidized, reduced } = req.body;

        const newQuestion = new Level2({
            question,
            oxidized,
            reduced
        });

        await newQuestion.save();

        res.status(201).json({ ok: "Added", message: 'Level 2 question added successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to add Level 2 question.' });
    }
});


router.get("/getLevel2Questions", auth, async (req, res) => {
    try {
        const getQuestions = await Level2.find();

        if (!getQuestions) {
            return res.status(404).json({ message: 'Level 2 questions not found.' });
        }

        res.status(200).json({ ok: "Fetched", questions: getQuestions });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to fetch Level 2 questions.' });
    }
});


router.put("/level2Questions/:questionNumber", auth, async (req, res) => {
    try {
        const { question, oxidized, reduced } = req.body;
        const questionNumber = req.params.questionNumber;

        const updatedQuestion = await Level2.findOneAndUpdate(
            { questionNumber: questionNumber },
            { question, oxidized, reduced },
            { new: true }
        );

        if (!updatedQuestion) {
            return res.status(404).json({ message: 'Level 2 question not found.' });
        }

        res.status(200).json({ ok: "Updated", message: 'Level 2 question updated successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to update Level 2 question.' });
    }
});


router.delete("/level2Questions/:questionNumber", auth, async (req, res) => {
    try {
        const questionNumber = req.params.questionNumber;

        const deletedQuestion = await Level2.findOneAndDelete({ questionNumber: questionNumber });

        if (!deletedQuestion) {
            return res.status(404).json({ message: 'Level 2 question not found.' });
        }

        res.status(200).json({ ok: "Deleted", message: 'Level 2 question deleted successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, failed to delete Level 2 question.' });
    }
});


module.exports = router