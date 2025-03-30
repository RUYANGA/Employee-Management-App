const mongoose=require('mongoose');

const employeeSchema=new mongoose.Schema({
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
    phone:{
        type:String,
        required:true
    },
    role:{
        type:String,
        required:true,
        default:'user'
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
})

module.exports=mongoose.model('Employee',employeeSchema)