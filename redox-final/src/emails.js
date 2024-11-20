const nodemailer = require("nodemailer");
const dotenv=require('dotenv').config();
const sendEmail = process.env.EMAIL_ID
const mailPass = process.env.EMAIL_PASSWORD

const sendOTP = (email,OTP) => {
    const passwordMsg = {
        from: "gdp05fa24@gmail.com",
        to: email,
        subject: `Redox Game - OTP`,
        html:`<div><h4>Hi, Your OTP to verify mail in Redox Game is - ${OTP} .</h4> <br> <h5>REDOX GAME.</h5>`
     }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "gdp05fa24@gmail.com",
            pass: "dhnkybhgmccqgslb "
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

const sendAccessCode = (email,accessCode) => {
    const passwordMsg = {
        from: "gdp05fa24@gmail.com",
        to: email,
        subject: `Redox Game - Access Code`,
        html:`<div><h4>Hi, Your Acess Code to verify access in Redox Game is - ${accessCode} .</h4> <br> <h5>REDOX GAME.</h5>`
     }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "gdp05fa24@gmail.com",
            pass: "dhnkybhgmccqgslb "
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

const sendResetLink = (mail,link) => {
    const passwordMsg = {
        from: "gdp05fa24@gmail.com",
        to: mail,
        subject: `Redox Game Account Reset Password Link`,
        html:`<div><h4>Hi User, Here is the link for reseting password of your account in Redox game\n <br> <br>The link is only vaild for 10 minutes. </h4><a href=${link}>Link</a>`
     }

    let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "gdp05fa24@gmail.com",
            pass: "dhnkybhgmccqgslb "
        }
    });

    return new Promise((resolve, reject) => {
        transporter.sendMail(passwordMsg, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log("Email sent");
                resolve();
            }
        });
    });
};

module.exports={
    sendOTP,
    sendAccessCode
}