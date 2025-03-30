const User=require('../modeles/User');
const bcrypt=require('bcrypt')
const crypto=require('crypto');
const {addMinutes}=require('date-fns')
const nodemailer=require('nodemailer');
const {validationResult}=require('express-validator');





const Register=async(req,res,next)=>{

    
    try {
       
        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorFormat=errors.array().map(err=>({
                message:err.msg
            }))
            return res.status(400).json({error:errorFormat})
        }

        const {Fname,Lname,email,password}=req.body;
        const user=await User.findOne({email:email})
       
        const hashPassword=await bcrypt.hash(password,10);
        const otp=crypto.randomInt(100000,999999);
        const currentDate=new Date();
        const otpExpired=addMinutes(currentDate,15);

        const saveUser= await User.create({
            Fname,
            Lname,
            email,
            password:hashPassword,
            Otp:otp,
            otpExpired
        })
        const transporter=nodemailer.createTransport({
            service:'gmail',
            secure:true,
            auth:{
                user:process.env.Email,
                pass:process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:'OTP VERIFICATION CODE',
            html:` <!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <link href="	https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                <td style="padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <!-- Header -->
                    <div style="background-color: #4A90E2; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 26px;">Welcome to BINARY HUB  Intern</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 24px; line-height: 1.6;">
                        <p style="margin-top: 0; color: #333333; font-size: 16px;">Hello 👋 ${Lname},</p>
                        
                        <p style="color: #333333; font-size: 16px;">Thank you for signing up! We're excited to have you on board.</p>
                        
                        <p style="color: #333333; font-size: 16px;">Here are verification code  to help you get started this code expired in 15 minutes:</p>
                        
                    
                        
                        <div style="margin: 30px 0; text-align: center;">
                        <h1 style="background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">${otp}</h1>
                        </div>
                        
                        <p style="color: #333333; font-size: 16px;">If you have any questions, just reply to this email. We're always here to help!</p>
                        
                        <p style="color: #333333; font-size: 16px;">Best regards,<br>Merci RUYANGA</p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f4f4f4; padding: 24px; text-align: center;">
                        <p style="margin: 0; color: #777777; font-size: 14px;">
                        © 2025 Your Company. All rights reserved.
                        </p>
                        <p style="margin: 10px 0 0; color: #777777; font-size: 14px;">
                        <a href="#" style="color: #777777; text-decoration: underline;">Unsubscribe</a> |
                        <a href="#" style="color: #777777; text-decoration: underline;">Privacy Policy</a>
                        </p>
                        <div style="margin-top: 20px;">
                        <a href="https://www.facebook.com/ruyanga.merci.1" style="display: inline-block; margin: 0 10px; color: #4A90E2;">
                        
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a href="https://x.com/RuyangaM" style="display: inline-block; margin: 0 10px; color: #4A90E2;">
                            <i class="bi bi-twitter-x"></i>
                        </a>
                        <a href="https://github.com/RUYANGA" style="display: inline-block; margin: 0 10px; color: #4A90E2;">
                            <i class="bi bi-github"></i>
                        </a>
                        </div>
                    </div>
                    </div>
                </td>
                </tr>
            </table>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>`
            
        });

        res.status(200).json({message:`User register successfully veryfy otp sent to ${email}`})
    } catch (error) {
        const err= new Error(error)
        err.status=500,
        next(err)
            
    }


}

const verifyOtp=async(req,res,next)=>{
  try {


        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorFormat=errors.array().map(err=>({
                message:err.msg
            }))
            return res.status(400).json({error:errorFormat})
        }
        const {email,Otp}=req.body
       
        const user=await User.findOne({email:email});
        if(user.Otp !==Otp || user.otpExpired < new Date()){
            return res.status(400).json({message:"Otp expired or invalid !"});
        } 

        user.Otp=undefined;
        user.otpExpired=undefined;
        user.isVerified=true
        await user.save()

        res.status(200).json({message:"Email is verified successfuly. Now you can login"});

  } catch (error) {

        const err=new Error(error);
        err.status=500
        next(err)

  }
}

const resendOtp=async(req,res,next)=>{
   try {

        const {email}=req.body;

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorFormat=errors.array().map(err=>({
                message:err.msg
            }))
            return res.status(400).json({error:errorFormat})
        }

        const user=await User.findOne({email:email})
        const otp=crypto.randomInt(100000,999999);
        const currentDate=new Date();
        const otpExpired=addMinutes(currentDate,15);

        user.Otp=otp;
        user.otpExpired=otpExpired;
        await user.save();

        const transporter=nodemailer.createTransport({
            service:'gmail',
            auth:{
                user:process.env.Email,
                pass:process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from:process.env.EMAIL,
            to:email,
            subject:'OTP VERIFICATION CODE',
            html:` <!DOCTYPE html>
            <html>
            <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome Email</title>
            <link href="	https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
            </head>
            <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f4f4f4;">
            <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                <td style="padding: 0;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                    <!-- Header -->
                    <div style="background-color: #4A90E2; padding: 24px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 26px;">Welcome to BINARY HUB  Intern</h1>
                    </div>
                    
                    <!-- Content -->
                    <div style="padding: 24px; line-height: 1.6;">
                        <p style="margin-top: 0; color: #333333; font-size: 16px;">Hello 👋 ${user.Lname},</p>
                        
                        <p style="color: #333333; font-size: 16px;">Thank you for signing up! We're excited to have you on board.</p>
                        
                        <p style="color: #333333; font-size: 16px;">Here are verification code  to help you get started this code expired in 15 minutes:</p>
                        
                    
                        
                        <div style="margin: 30px 0; text-align: center;">
                        <h1 style="background-color: #4A90E2; color: #ffffff; text-decoration: none; padding: 12px 24px; border-radius: 4px; font-weight: bold; display: inline-block;">${otp}</h1>
                        </div>
                        
                        <p style="color: #333333; font-size: 16px;">If you have any questions, just reply to this email. We're always here to help!</p>
                        
                        <p style="color: #333333; font-size: 16px;">Best regards,<br>Merci RUYANGA</p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f4f4f4; padding: 24px; text-align: center;">
                        <p style="margin: 0; color: #777777; font-size: 14px;">
                        © 2025 Your Company. All rights reserved.
                        </p>
                        <p style="margin: 10px 0 0; color: #777777; font-size: 14px;">
                        <a href="#" style="color: #777777; text-decoration: underline;">Unsubscribe</a> |
                        <a href="#" style="color: #777777; text-decoration: underline;">Privacy Policy</a>
                        </p>
                        <div style="margin-top: 20px;">
                        <a href="https://www.facebook.com/ruyanga.merci.1" style="display: inline-block; margin: 0 10px; color: #4A90E2;">
                        
                            <i class="bi bi-facebook"></i>
                        </a>
                        <a href="https://x.com/RuyangaM" style="display: inline-block; margin: 0 10px; color: #4A90E2;">
                            <i class="bi bi-twitter-x"></i>
                        </a>
                        <a href="https://github.com/RUYANGA" style="display: inline-block; margin: 0 10px; color: #4A90E2;">
                            <i class="bi bi-github"></i>
                        </a>
                        </div>
                    </div>
                    </div>
                </td>
                </tr>
            </table>
            <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
            </body>
            </html>`
        })
    res.status(201).json({message:"Otp resend successfully!"});

   } catch (error) {

        const err=new Error(error);
        err.status=500,
        next(err)
   }
}

const Login=async(req,res,next)=>{

    try {
        const {email,password}=req.body;

        const errors=validationResult(req);
        if(!errors.isEmpty()){
            const errorFormat=errors.array().map(err=>({
                message:err.msg
            }))
            return res.status(400).json({error:errorFormat});
        };

        const user =await User.findOne({email:email});

        if(!await bcrypt.compare(password,user.password)){
           return res.status(401).json({message:'Email or password incorect!'});
        };
        req.session.user=user;
        res.status(200).json({message:'Login successfully!'});

    } catch (error) {

            const err=new Error(error);
            err.status=500,
            next(err)
    }
    
}


const lognOut=async(req,res,next)=>{
    try {
        
        req.session.destroy((err)=>{
            if(err)return res.status(500).json({message:'Error to logn out'});
        })
        res.clearCookie('connect.sid');
        res.status(200).json({message:"Logn out successfuly"})

    } catch (error) {

      const errors= new Error(error);
      errors.statusCode=500;
      return next(errors);
    }
}

const Dashboard=async(req,res,next)=>{

    const user=await User.find({_id:req.session.user._id}).select('Fname Lname email _id phone').populate('Employees');
    if(!user)return res.status(400).json({message:"User not found"});
    const returnUser=user.map(user=>({
        UserId:user._id,
        FirstName:user.Fname,
        LastName:user.Lname,
        Email:user.email,
        Employees:user.Employees.map(employee=>({
            EmployeeId:employee._id,
            Emp_FirstName:employee.Fname,
            Emp_LastName:employee.LName,
            Emp_Email:employee.email,
            Emp_PhoneNumber:employee.phone,
            Emp_Role:employee.role,
            
        }))

    }))

    res.status(200).json({Dshboard:user})
}

module.exports={Register,verifyOtp,resendOtp,Login,lognOut,Dashboard} ;