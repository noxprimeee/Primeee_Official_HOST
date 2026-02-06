const express = require('express')
const fs = require('fs')
const botManager = require('./botManager')

const app = express()

app.use(express.json())
app.use(express.static('./'))

// ===== DATABASE LOCAL =====

if(!fs.existsSync('database.json')){

fs.writeFileSync('database.json', JSON.stringify({

users:[
{email:"admin",password:"admin",admin:true,coins:999999}
]

}))

}

function db(){

return JSON.parse(fs.readFileSync('database.json'))

}

function save(data){

fs.writeFileSync('database.json',JSON.stringify(data,null,2))

}

// ===== DEPLOY =====

app.post('/deploy',(req,res)=>{

const {repo} = req.body

const id = botManager.deployBot(repo)

res.json({bot:id})

})

// ===== ADMIN BAN =====

app.post('/ban',(req,res)=>{

const data = db()

const user = data.users.find(u=>u.email==req.body.email)

if(user) user.banned=true

save(data)

res.json({ok:true})

})

app.listen(process.env.PORT || 3000,()=>{

console.log("🔥 GOD MODE HOSTING RUNNING")

})
