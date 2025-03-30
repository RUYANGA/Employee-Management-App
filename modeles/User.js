const mongoose=require('mongoose');
const Employee = require('./Employee');


const userSchem=new mongoose.Schema({
    Fname:{
        type:String,
        required:true
    },
    Lname:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    Otp:{
        type:String
    },
    otpExpired:{
        type:Date
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    Employees:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Employee'
    }]

})

module.exports= mongoose.model('User',userSchem);