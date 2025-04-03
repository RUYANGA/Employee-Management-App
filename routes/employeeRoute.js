const {
    addEmployee,
    updateEmployee,
     updateEmployeeRole
}=require('../controllers/employee');
const {
    unauthrized,
    Admin
}=require('../middlewares/authorize');
const {addEmployeeValidator}=require("../middlewares/validations")

const router=require('express').Router();

router.post('/add',unauthrized,addEmployeeValidator,addEmployee);
router.put('/update/:id',unauthrized,updateEmployee);
router.put('/updaterole/:id',unauthrized,Admin,updateEmployeeRole);




module.exports=router