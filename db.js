const Pool=require('pg').Pool;
const questionPool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'questiondb',
    password:'daisy',
    port:5433
});

const userPool=new Pool({
    user:'postgres',
    host:'localhost',
    database:'userdb',
    password:'daisy',
    port:5433
});

module.exports= {user:{
query:(text, params)=>userPool.query(text, params),

insert:async (first_name, last_name, email, password)=>{await userPool.query("INSERT INTO users(first_name, last_name, email, password) VALUES($1, $2, $3, $4)", [first_name, last_name, email, password]); console.log("inserted");},

delete:async (email)=>{await userPool.query("DELETE FROM  users WHERE email=$1", [email]); console.log("deleted");},

update:async (param, primaryKey, primaryKeyValue, setValue)=>{await userPool.query("UPDATE users SET "+param+"=$2 WHERE "+primaryKey+"=$1", [primaryKeyValue, setValue]); console.log("updated");},

getClient:()=>userPool.connect(),

close:()=>userPool.end()
},
 question:{
    query:(text, params)=>questionPool.query(text, params),
    getClient:()=>questionPool.connect(),
    close:()=>questionPool.end() 
 }};