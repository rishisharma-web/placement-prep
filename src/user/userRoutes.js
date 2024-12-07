const {Router}=require('express');
const jwt=require('jsonwebtoken');
const {z}=require('zod');
const {user, question}=require('../../db.js');
const router=Router();
function authenticate(req, res, next)
{
    try{
    const token=req.headers.token;
    jwt.verify(token, pass);
    next();
    }
    catch(err)
    {
        console.log(err);
    }
}
function userValidation(req, res, next)
{
    console.log("entry in user validation fine");
    const userSchema=z.object({
        first_name:z.string()
        .regex(/^[A-Za-z]+$/, {message:"Name can only contain letters"})
        .trim(),
        last_name:z.string()
        .regex(/^[A-Za-z]+$/, {message:"Last name can only contain letters"})
        .trim(),
        email:z.string()
        .email({message:"Provide valid email"}),
        password:z.string()
        .min(7, {message:"password should be atleast of 7 length"})
    });
   const result= userSchema.safeParse({first_name:req.headers.first_name, 
        last_name:req.headers.last_name,
        email:req.headers.email,
        password:req.headers.password
    });
    if (!result.success) {
      //  console.log(result.error);
        return res.status(400).json({
            
            errors: result.error.errors.map(err => err.message)
        });
    }
    console.log("exit from user validation fine");
    next();
}
router.get('/', async (req, res)=>{
    //res.send("Routes for the user");
    try{
    await user.update('password', 'email', 'rishisharma9058@gmail.com', 'Agra@3321');
    const result=await user.query("SELECT * FROM users");
    console.log("yahan to dikkat nahi");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
}
})


router.post('/login', async (req, res)=>
{
const email=req.body.email;
const password=req.body.password;
const result=await user.query("SELECT password FROM users WHERE email=$1",[email]);
console.log(result);
if(result.rows.length==0)
{
  
    res.json({
        msg:"User does not exists!"
    });
    return;
}

if(result.rows[0].password===password)
{
    const token= jwt.sign({email:email}, 'pass');
    console.log(token);
    res.json({msg:"User verified successfully"});
}
else
{
    res.json({msg:"Wrong credentials"});
}
}
)


router.post('/signup', userValidation, async (req, res)=>
{
const first_name=req.headers.first_name;
const last_name=req.headers.last_name;
const email=req.headers.email;
const password=req.headers.password;
const result=await user.query("SELECT * FROM users WHERE email=$1", [email]);
console.log(result);
if(result.rows.length==1)
{
    res.json({msg:"user already exists"});
    return;
}
else
{
    await user.insert(first_name, last_name, email, password);
    res.json({msg:"user added successfully"});
}
});
router.get('/questions',  async (req, res)=>
{
//     console.log(req.query.difficulty);
//    res.send(req.query.difficulty);
//    return;
var questions;
if(!req.query.hasOwnProperty('difficulty'))
questions=await question.query("SELECT * FROM questions");
else
{
   const diff= req.query.difficulty.toString().substring(0, 1).toUpperCase();
questions=await question.query("SELECT * FROM questions WHERE q_difficulty=$1",[diff]);
}
console.log(questions);
const qObject=await Promise.all(questions.rows.map(async (element)=>
{
    const options=await question.query("SELECT * FROM options WHERE q_id=$1", [element.q_id]);
   // console.log({q:element, o:options.rows});
    return {q:element, o:options.rows};
}));
//console.log(qObject);
res.send(qObject);
})
module.exports=router;