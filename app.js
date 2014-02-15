
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});

var io = require('socket.io').listen(server);

io.sockets.on('connection', function (socket) {

  socket.on('test', function (data) {
    socket.emit('test', "zenbu tamefusa no sei da");
  });

  socket.emit('test', "first emit");

});

/*app.get('/', routes.index);
app.get('/users', user.list);

// ulsayメイン
app.get('/ulsay', ulsay.init);

// rss情報の取得
app.get('/fetchRss', ulsay.fetchRss);

// ローマ字変換したデータをwebsoketで送信
app.get('/sendSay',  function() {

});*/

/*
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});*/
