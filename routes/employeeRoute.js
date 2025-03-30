const {addEmployee,updateEmployee, updateEmployeeRole}=require('../controllers/employee');
const {unauthrized,Admin}=require('../middlewares/authorize');
const {body}=require('express-validator')
const Employee=require('../modeles/Employee');



const router=require('express').Router();

router.post('/add',unauthrized,[
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
    
],addEmployee);


router.put('/update/:id',unauthrized,updateEmployee)
router.put('/updaterole/:id',unauthrized,Admin,updateEmployeeRole)




module.exports=router