const express= require('express');
const userRoutes=require('./src/user/userRoutes.js');
const app=express();
app.use(express.json());
const port=3000;
app.get('/', (req, res)=>
{
    res.send("Hello! Welcome to quizzy");
})
app.use('/user', userRoutes);
app.listen(port, ()=>{console.log("app is listening on port 3000")});