const{
    Register,
    verifyOtp,
    resendOtp,
    Login,
    lognOut,
    Dashboard
    }=require('../controllers/auth');

const {unauthrized,Admin}=require('../middlewares/authorize')

const { body }=require('express-validator')
const User=require('../modeles/User')

const router=require('express').Router();

router.post('/signup',[
    body('Fname')
    .notEmpty()
    .withMessage('email requie')
    .isAlpha()
    .isLength({min:3})
    .trim()
    .escape()
    .withMessage('First name must be atleast 3 characters!'),
    body('Lname')
    .notEmpty()
    .isLength({min:3})
    .withMessage('Last name must be atleast 3 character!')
    .toUpperCase()
    .trim()
    .escape(),
    body('email')
    .notEmpty()
    .withMessage('Email is required')
    .normalizeEmail()
    .toLowerCase()
    .trim()
    .escape()
    .withMessage('Provide a valid email format')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(user=>{
            if(user){
                return Promise.reject(
                    'User with email taken , choose another one'
                )
            }
        })
    }),
    body('password')
    .notEmpty()
    .isLength({min:6})
    .isStrongPassword()
    .trim()
    .escape()
    .withMessage('Password must be contain character , numbers ,symbol and 8 length')
],Register);

router.post('/verify',[
    body('email')
    .notEmpty()
    .normalizeEmail()
    .toLowerCase()
    .trim()
    .escape()
    .withMessage('Provide valid email format')
    .custom((email,{req})=>{
        return User.findOne({email:email})
            .then(user=>{
                if(!user){
                    return Promise.reject(
                        'User with email not found!'
                        
                    )
                }else if(user.isVerified){
                    return Promise.reject(
                        'Email already verified'
                    )
                }
            })
        
    }),
    body('Otp')
    .notEmpty()
    .withMessage('Otp required!'),
   
],verifyOtp)

router.post('/resendOtp',[
    body('email')
    .notEmpty()
    .withMessage('Email is required')
    .normalizeEmail()
    .toLowerCase()
    .trim()
    .escape()
    .withMessage('Provide valid email format')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(user=>{
            if(!user){
                return Promise.reject(
                    'User with emaill not found'
                )
            }else if(user.isVerified){
                return Promise.reject(
                    'Email already verified'
                )
            }
        })
    })
],resendOtp)

router.post('/login',[
    body('email')
    .notEmpty()
    .normalizeEmail()
    .escape()
    .withMessage('Provide valid email format')
    .custom((value,{req})=>{
        return User.findOne({email:value})
        .then(user=>{
            if(!user){
                return Promise.reject(
                    'Email or password incorect!'
                );
            }else if(!user.isVerified){
                return Promise.reject(
                    'Email is not varified!'
                );
            }
        })
    }),
    body('password')
    .notEmpty()
    .trim()
    .withMessage('Provide password!')
],Login);

router.post('/dashboard',unauthrized,Dashboard)

router.post('/lognout',unauthrized,lognOut)



module.exports=router
