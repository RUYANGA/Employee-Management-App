require('dotenv').config()
const express=require('express');
const port=process.env.PORT;
const mongoose=require('mongoose')
const session=require('express-session');
const cors=require('cors')
const sessionStore=require('connect-mongo')
const authController=require('./routes/authRoute')
const employeeController=require('./routes/employeeRoute');


const app=express();

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log(`DB is connected successfully`);
    app.listen(port,()=>{
        console.log(`Server is running on http://localhost:${port}`)
    })
})
.catch((err)=>{
    console.log('Error to connect DB',err)
})

//middleware
app.use(express.json());
app.use(session({
    secret:process.env.SECRET_SESSION,
    resave:false,
    saveUninitialized:false,
    store:sessionStore.create({
        mongoUrl:process.env.DB_URL
    }),
    cookie:{
        secure:true,
        httpOnly:true,
        maxAge:1000*60*60*24*7
    }
}))
app.use(cors({
    origin:'https://binary-hub.onrender.com',
    allowedHeaders: "Content-Type",
    credentials:true,
    methods:['GET','POST','PUT','PUCH','DELETE']
}))

app.use('/api/user',authController)
app.use('/api/employee',employeeController)

app.use((error,req,res,next)=>{
    return res.status(500).json({errors:error.message || 'Something went wronge'})
});
