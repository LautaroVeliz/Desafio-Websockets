const fs = require('fs')
const express = require('express')
const PORT = 8080
const { Server: IOServer } = require('socket.io')
const { Server: HttpServer } = require('http')

const app = express()
const httpServer = new HttpServer(app)
const io = new IOServer(httpServer)

const productos = []
let messages = []

try {
    let contenido = fs.readFileSync("./messages.txt", 'utf-8')
    messages = JSON.parse(contenido)
} catch (error) {
    console.log(error)
    console.log("Archivo no encontrado. Se creara uno para su conveniencia.");
    try {
        let contenido = '[]'
        fs.writeFileSync("./messages.txt", contenido)
        console.log("Archivo Creado")
        messages = JSON.parse(contenido)
    } catch (e) {
        console.log(error)
        console.log("Error al intentar crear el archivo: " + e)
    }
}

console.log(messages)

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
        fs.writeFileSync('./messages.txt', JSON.stringify(messages))
        io.sockets.emit('messages', messages)
    })
})