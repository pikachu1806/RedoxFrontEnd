const mongoose = require("mongoose")
const validator=require("validator")
const bcrypt=require("bcryptjs")
const jwt=require("jsonwebtoken")
const { boolean } = require("webidl-conversions")


const UserSchema = mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true
    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique: true,
        required:true,
        trim:true,
        lowercase:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is invalid!")
            }
        }
    },
    password:{
        type:String,
        required:true,
        trim:true,
            
    },
    verfied: {
        type: Boolean,
        required: false
    }
})





//Professordef function for authentication
UserSchema.statics.findByCredentials = async (email,password) => {
    const user = await User.findOne({ email })
   // console.log(user, email)
    if(!user){
        throw new Error("Email is incorrect")
    }
    const isMatched = await bcrypt.compare(password,user.password)
    if(!isMatched){
        throw new Error("password is incorrect")
    } else{
        return user
    }
}

//Professordef function for authentication
UserSchema.statics.findByEmail = async (email) => {
    // console.log("erwe")
    const user = await User.findOne({ email })
    // console.log(User,"User")
    if(!user){
        throw new Error("unable to find")
    }
    return user
}

//Professordef function for authentication
UserSchema.statics.findProfessorById = async (id) => {
    console.log("reached schemma")
    const user = await User.findById({_id : id})
    // console.log(User,"User")
    if(!user){
        throw new Error("unable to find")
    }
    return user
}

//using mongoose middleware for hashing passwords
UserSchema.pre("save",async function (next) {
    const user = this
    console.log("User data received")
   if(user.isModified('password')){
       user.password=await bcrypt.hash(user.password,8)
   }
    next()
})

//creating a User model
const User = mongoose.model('User',UserSchema)

module.exports=User