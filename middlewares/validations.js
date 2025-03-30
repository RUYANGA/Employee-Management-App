const { body }=require('express-validator')
const User=require('../modeles/User')
const Employee=require('../modeles/Employee');


const siginupValidator=[
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
];

const loginValidator=[
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
];


const verifyValidator=[
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
   
];

const resendOtpValidator=[
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
];

const addEmployeeValidator=[
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
           return Employee.findOne({email:value})
           .then(user=>{
               if(user){
                   return Promise.reject(
                       'User with email taken , choose another one'
                   )
               }
           })
       }),
       body('phone')
       .notEmpty()
       .isNumeric()
       .isLength({min:10})
       .escape()
       .matches(/^\+250\d{9}$/)
       .withMessage('Phone number must start with +250 and 9 digit after'),
       body('role')
       .notEmpty()
       .trim()
       .toLowerCase()
       .escape()
       .withMessage('Provide role of employee!')
   
]


module.exports={siginupValidator,loginValidator,verifyValidator,resendOtpValidator,addEmployeeValidator};