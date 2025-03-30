const{
    Register,
    verifyOtp,
    resendOtp,
    Login,
    lognOut,
    Dashboard,
    updateUser
    }=require('../controllers/auth');

const {unauthrized,Admin}=require('../middlewares/authorize');
const {
    siginupValidator,
    loginValidator,
    verifyValidator,
    resendOtpValidator

}=require("../middlewares/validations");
const {body}=require('express-validator');

const router=require('express').Router();

router.post('/signup',siginupValidator,Register);

router.post('/verify',verifyValidator,verifyOtp);

router.post('/resendOtp',resendOtpValidator,resendOtp);

router.post('/login',loginValidator,Login);

router.post('/dashboard',unauthrized,Dashboard);

router.post('/lognout',unauthrized,lognOut);

router.put('/update',updateUser)



module.exports=router
