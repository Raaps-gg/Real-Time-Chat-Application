const express = require('express')
const app = express()
const routes = require('./Routes/authRoutes')

require('dotenv').config()
const PORT = process.env.PORT

const mongoose = require('mongoose');
const connectDb = async (req, res) => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        console.log('Connected to Database')
    } catch(err) {
        console.log(err)
    }
}

const cors = require('cors')
const http = require('http')
const server = http.createServer(app)

const { Server } = require('socket.io')
const io = new Server(server, {
    cors: {
        origin: `*`,
        methods: ['GET', 'POST']
    }
})
app.use(cors())
app.use(express.json())

io.on("connection", (socket) => {
    console.log(`User ${socket.id} connected`)

    socket.on("joinRoom", (room) => {
        socket.join(room)
        console.log(`User ${socket.id} joined room ${room}`)
    })

    socket.on("sendMessage", (message) => {
        socket.to(message.room).emit("receiveMessage", message)
        console.log(message)
    })
    socket.on("disconnect", () => {
        console.log(`User ${socket.id} disconnected`)
    })
})

app.get('/', (req, res) => {
    res.json({message: 'Hello world',});
  });

app.use('/api/auth', routes)

server.listen(PORT, (req, res) => {
    connectDb()
    console.log(`listening on port ${PORT}`)
})

