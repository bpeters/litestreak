var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 8080;
var _ = require('lodash');

app.get('/', function(req, res){
  res.sendfile('views/index.html');
});

app.get('/edit', function(req, res){
  res.sendfile('game/weltmeister.html');
});

app.use(express.static(path.join(__dirname, '/game')));
app.use(express.static(path.join(__dirname, '/public')));

var playerlist = [];

io.on('connection', function(socket){

  socket.on('initializeplayer', function (newplayername) {
    socket.clientname = newplayername;
    playerlist.push(newplayername);
    io.sockets.emit('addplayer', playerlist, newplayername);
    console.log(newplayername + " joined");
  });

  socket.on('recievedata', function (action, data) {
    if (action == 'move') {
      socket.broadcast.emit('playermove', data);
    } else if (action == 'shoot') {
      socket.broadcast.emit('playershoot', data);
    } else if (action == 'sync') {
      socket.broadcast.emit('playersync', data);
    }
  });

  socket.on('killplayer', function() {
    if(socket.clientname) {
      console.log(socket.clientname + " has died");
      playerlist = _.difference(playerlist, [socket.clientname]);
      socket.broadcast.emit('removeplayer',socket.clientname);
      socket.broadcast.emit('message',socket.clientname, 'died');
    }
  });

  socket.on('disconnect', function() {
    if(socket.clientname) {
      console.log(socket.clientname + " has left");
      playerlist = _.difference(playerlist, [socket.clientname]);
      socket.broadcast.emit('removeplayer',socket.clientname);
      socket.broadcast.emit('message',socket.clientname, 'left');
    }
  });

});

http.listen(port, function(){
  console.log('listening on localhost:' + port);
});
