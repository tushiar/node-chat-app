const express = require('express')
const path = require('path')
const http = require('http')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage, generateLocationMsg} = require('./utils/messages')
const {addUser, removeUser, getUsers, getUsersInRoom} = require('./utils/users')
const publicDirectoryPath = path.join(__dirname, '../public')
const app = express()
const server = http.createServer(app)
const io = socketio(server)

app.use(express.static(publicDirectoryPath))

const port = process.env.PORT || 3000
// let count =0
io.on('connection', (socket)=>{
    console.log('New Socket Connection')
   
    socket.on('join', (options, callback)=>{
        const {error, user}= addUser({id: socket.id, ...options})

        if(error){
            return callback(error)
        }

        socket.join(user.room)


        socket.emit('message', generateMessage('Admin','Welcome to Tushar\'s chat app'))
        socket.broadcast.to(user.room).emit('message' ,generateMessage('Admin',`${user.displayName} has joined`))
    

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })
    })

    socket.on('message', (message, callback)=>{
        // const filter = new Filter()
        // if(filter.isProfane(message)){
        //     return callback('Bad words not allowed')
        // }
        const user = getUsers(socket.id)
        io.to(user.room).emit('message', generateMessage(user.displayName, message))
        callback()
    })

    socket.on('disconnect', ()=>{
        const user= removeUser(socket.id)

        if(user){
            io.to(user.room).emit('message', generateMessage('Admin',`${user.displayName} has left!!`))
            io.to(user.room).emit('roomData', {
                room: user.room,
                users: getUsersInRoom(user.room)
            })
        }

    })

    socket.on('sendLocation', (location, callback)=>{
        const user= getUsers(socket.id)
        io.to(user.room).emit('location-url', generateLocationMsg(user.displayName, 'https://www.google.com/maps?q='+location.latitude +","+ location.longitude))

        callback()
    })
    // socket.emit('countUpdated', count)
    // socket.on('increment', ()=>{
    //     console.log('User incremented')
    //     count++
    //     io.emit('countUpdated', count)
    // })
})



server.listen(port, ()=>{
    console.log(`Server is running at port ${port}!!!`)
})
