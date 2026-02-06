const { spawn, spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')
const { v4: uuid } = require('uuid')

let runningBots = {}

function deployBot(repo){

const id = uuid()

const dir = `bots/${id}`

spawnSync('git',['clone',repo,dir],{stdio:'inherit'})

spawnSync('npm',['install'],{cwd:dir,stdio:'inherit'})

startBot(id,dir)

return id

}

function startBot(id,dir){

const child = spawn('node',['index.js'],{
cwd:dir,
stdio:['pipe','pipe','pipe']
})

runningBots[id] = child

child.stdout.on('data', d=>{

console.log(`[BOT ${id}]`, d.toString())

})

child.on('exit', code=>{

console.log("bot crashed -> restarting")

startBot(id,dir)

})

}

function stopBot(id){

if(runningBots[id]){

runningBots[id].kill()

delete runningBots[id]

}

}

module.exports = { deployBot, stopBot }
