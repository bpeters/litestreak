var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;

app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

app.get('/edit', function(req, res){
  res.sendfile('game/weltmeister.html');
});

app.use(express.static(path.join(__dirname, '/game')));
app.use(express.static(path.join(__dirname, '/public')));

var playerlocation = 0;
var playerlist = [];

io.on('connection', function(socket){

  socket.on('initializeplayer', function (newplayername) {
    socket.clientname = newplayername;
    playerlist.push(newplayername);
    io.sockets.emit('addplayer',playerlist,newplayername);
    console.log(newplayername + " joined");
  });

  socket.on('recievedata', function (action, data) {
    if (action == 'move') {
      socket.broadcast.emit('playermove', data);
      console.log(data);
    } else if (action == 'shoot') {
      socket.broadcast.emit('playershoot', data);
      console.log(data);
    } else if (action == 'sync') {
      socket.broadcast.emit('playersync', data);
      console.log(data);
    }
  });

  socket.on('disconnect', function() {
    console.log(socket.clientname + " has left");
    delete playerlist[socket.clientname];
    for(var i in playerlist) {
      if(playerlist[i] == socket.clientname) {
        playerlist.splice(i, 1);
      }
    }
    socket.broadcast.emit('message',socket.clientname);
    socket.broadcast.emit('netreplayer',playerlist);
  });

});

http.listen(port, function(){
  console.log('listening on localhost:' + port);
});
