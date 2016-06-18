var express = require('express'),
    app = express(),
    http = require('http'),
    server = http.createServer(app),
    io = require('socket.io')(server),
    config = require('./config')

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')
})

var userList = []

io.on('connection', function (socket) {

    var group = {
        id : 'group',
        name: '多人聊天室',
        portrait: 'http://vuejs.org/images/logo.png'
    }

    socket.emit('newChat',group)
    socket.emit('newChat',userList)

    var userNum = +(+new Date() + '').substr(-3,2)
    if(userNum == 0){
        userNum = '01'
    }else if(userNum < 10){
        userNum = '0' + userNum
    }

    var user = {
        id : socket.id,
        name: (+new Date() + '').substr(-3,5),
        portrait: 'http://fengfan.me/public/images/portrait/'+ userNum +'.jpg'
    }

    userList.push(user)
    socket.emit('user',user)
    socket.broadcast.emit('newChat',user)

    socket.on('disconnect', function () {
        socket.broadcast.emit('userLeave', user)
        for(var i=0;i<userList.length;i++){
            if(userList[i]['id'] == socket.id){
                userList.splice(i,1)
                break
            }
        }
    });

    socket.on('privateMsg',function(msg){
        socket.in(msg.to.id).emit('newMsg',msg)
    })

    socket.on('groupMsg',function(msg){
        socket.broadcast.emit('newMsg',msg)
    })
})

server.listen(config.server.port, config.server.host)
console.log("Server starts http://" + config.server.host + ":" + config.server.port)