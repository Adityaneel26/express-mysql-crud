const { faker } = require('@faker-js/faker');
const mysql=require('mysql2')
const express = require('express')
const app=express();
const path= require("path")
const methodoverride=require("method-override");
const { Console } = require('console');

app.use(express.static(path.join(__dirname,"public")))
app.use(methodoverride("_method"))
app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.set("view engine","ejs")
app.set("views",path.join(__dirname,"/views"))

const connection= mysql.createConnection({
    host:'localhost'
    ,user:'root'
    ,database:'delta_app'
    ,password:'password'
})
let getRandomUser=()=> {
  return [
     faker.string.uuid(),
    faker.internet.username(),
     faker.internet.email(),
     faker.internet.password(),
    
  ];
}
// let queryy="insert into user(id,username,email,password) values ?";
// // let users=[['a02','rishi','rishi@gmail.com','rishi@123'],
// // ['a03','rohit','rohit@gmail.com','rohit@123']]

// let data=[]
// for(let i=1;i<=100;i++)
// {
//     // console.log(getRandomUser())
//     data.push(getRandomUser())
// }



// console.log(createRandomUser())
app.listen("8080",()=>{
    console.log("the server run on 8080 port")
})
app.get("/",(req,res)=>{
    let q=`select count(*) from user;`
    try{

        connection.query(q,(err,result)=>{
            if(err)throw err
            console.log(result)
            let count=result[0]["count(*)"]
            // res.send("success")
            res.render("home.ejs",{count})
        })
    }
    catch(e){
        console.log(e);
    }
    // res.send("welcome to the homme page brother")
})


app.get("/user",(req,res)=>{
    // res.send('ready')
    let q="select * from user"
    try{
        connection.query(q,(err,users)=>{
            if(err)throw err
            
            // console.log(result)
            // res.send(result)
            res.render("users.ejs",{ users })
        })
    }
    catch(e){
        console.log(e);
    }
})
//edit rout
app.get("/user/:id/edit",(req,res)=>{
    let {id}= req.params;
    let q=`select * from user where id='${id}'`;
      try{
        connection.query(q,(err,result)=>{
            if(err)throw err
            
            console.log(result)
            let user= result[0]
            // res.send(result)
            res.render("edit.ejs",{ user })
        })
    }
    catch(e){
        console.log(e);
    }
    // console.log(id)
})

// upadate routes
app.patch("/user/:id",(req,res)=>{
      let {id}= req.params;
      let{password:formpass,username:newusername}=req.body;
    let q=`select * from user where id='${id}'`;
      try{
        connection.query(q,(err,result)=>{
            if(err)throw err
            
            console.log(result)
            let user= result[0]
            if(formpass!=user.password){
                 res.send("wrong password")
            }
            else{
                let q2=`update user set username='${newusername}' where id='${id}'`
                connection.query(q2,(err,result)=>{
                        if(err) throw err 
                        res.redirect("/user")
                    })
            }
            // res.send(user)
            // res.render("edit.ejs",{ user })
        })
    }
    catch(e){
        console.log(e);
    }
//  res.send("updated")
})

//////////////////////////////////////Delete routes
app.delete("/user/:id/delete",(req,res)=>{
    let {id}=req.params;
    console.log(id)
    let q=`delete from user where id='${id}'`
    connection.query(q,(err,result)=>{
        if(err)throw err
        res.redirect("/user")
    })
})