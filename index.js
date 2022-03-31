const express = require('express')
const PORT = 8080
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const productos = []

const messages = []

app.use(express.static('./public'))
app.get('/', (req, res) => {
    res.sendFile('index.html')
})

httpServer.listen(8080, () => console.log('servidor Levantado'))

io.on('connection', (socket) => {
    console.log('se conecto un usuario')
    socket.emit('productos', productos)
    socket.emit('messages', messages)

    socket.on('new-producto', (data) => {
        productos.push(data)
        io.sockets.emit('productos', productos)
    })

    socket.on('new-message', (data) => {
        messages.push(data)
        io.sockets.emit('messages', messages)
    })
})