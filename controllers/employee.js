const Employee=require('../modeles/Employee');
const {validationResult}=require('express-validator');
const User = require('../modeles/User');




const addEmployee=async(req,res,next)=>{

   try {
        const {Fname,Lname,email,phone,role}=req.body;
        const id=req.session.user._id;

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorFormat=errors.array().map(err=>({
                message:err.msg
            }))
            return res.status(400).json({error:errorFormat})
        }  


        const saveEmploye= await Employee.create({
            user:id,
            Fname,
            Lname,
            email,
            phone,
            role

        })

        const updateUser=await User.findByIdAndUpdate({_id:id},{$push:{Employees:saveEmploye._id}},{new:true});
        
        if(!updateUser)return res.status(400).json({message:'User not found'})
    

        res.status(201).json({addEmployee:'Employee added sucessfully , check your dashboard!'})

   } catch (error) {
        const err= new Error(error)
        err.status=500,
        next(err)
   }

}

const updateEmployee=async(req,res,next)=>{
   try {
        const {Fname,Lname,email,phone}=req.body;
        const id=req.session.user._id;
        const empId=req.params.id;
        if(!empId)return res.status(400).json({message:'Employee id require'})
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorFormat=errors.array().map(err=>({
                message:err.msg
            }))
            return res.status(400).json({error:errorFormat})
        }  

        const employee=await Employee.findByIdAndUpdate({_id:empId},{$set:{Fname,Lname,email,phone}},{new:true});

        const updateUser=await User.findByIdAndUpdate({_id:id},{$set:{Employees:employee._id}},{new:true});
            
        if(!updateUser)return res.status(400).json({message:'User not found'});

        res.status(201).json({addEmployee:'Employee Ugdated sucessfully , check your dashboard!'})

   } catch (error) {
        const err= new Error(error)
        err.status=500,
        next(err)
   }
}

const updateEmployeeRole=async(req,res,next)=>{
   try {
        const{role}=req.body;
        const id=req.session.user._id;
        const empId=req.params.id;

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorFormat=errors.array().map(err=>({
                message:err.msg
            }))
            return res.status(400).json({error:errorFormat})
        }  


        const employee=await Employee.findByIdAndUpdate({_id:empId},{$set:{role}},{new:true});

        const updateUser=await User.findByIdAndUpdate({_id:id},{$set:{Employees:employee._id}},{new:true});
            
        if(!updateUser)return res.status(400).json({message:'User not found'});

        res.status(201).json({addEmployee:'Role of employee Updated sucessfully , check your dashboard!'})
   } catch (error) {
        const err= new Error(error)
        err.status=500,
        next(err)
   }

}


module.exports={addEmployee,updateEmployee,updateEmployeeRole}