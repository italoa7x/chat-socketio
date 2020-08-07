var express = require('express');
var path = require('path');

const app = express()
//cria um servidor http
const server = require('http').createServer(app)
//cria o servidor webSocket
const io = require('socket.io')(server)

//informa onde ficaram salvos os arquivos frontend que serao utilizados pelo webSocket
app.use(express.static(path.join(__dirname, 'public')))
//indica onde estao as views do frontend
app.set('views', path.join(__dirname, 'public'))
//informa qual engine sera utilizada, nesse exemplo, sera o html
app.engine('html', require('ejs').renderFile)

app.use('/', (req, res) => {
    res.render('index.html')
})

//guarda todas as mensagens
let messages=[]

//irá capturar qualquer cliente novo no socket
io.on('connection', socket => {
    //assim que conectar no socket, é enviado todas as mensagens para que as mesmas nao sejam perdidas
    socket.emit('previosMessage', messages)
    socket.on('sendMessage', data => {
        messages.push(data)
        //envia para todo mundo a mensagem que foi enviada
        socket.broadcast.emit('receivedMessage', data)
    })
})

server.listen(3000)