
/**
 * Module dependencies.
 */

var express = require( 'express' );
var routes = require('./routes' );
var user = require('./routes/user' );
var ulsay = require('./routes/ulsay' );
var http = require('http' );
var path = require('path' );
var exec = require('child_process' ).exec;

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

var io = require('socket.io').listen(server),
_socket = null;

io.sockets.on( 'connection', function( socket ) {

  _socket = socket;

  socket.on( 'test', function( data ) {
    //socket.emit( 'test', { 'data' : 'zenbu tamefusa no sei da' } );
    socket.emit( 'test', 2 );
  });

  //socket.emit( 'test', { 'data' : 'first emit' } );
  socket.emit( 'test', 1 );

});

// ulsayメイン
app.get( '/ulsay', ulsay.init );

// rss情報の取得
app.get( '/fetchRss', ulsay.fetchRss );

// ローマ字変換したデータをwebsoketで送信
app.get( '/sendSay',  function( req, res ) {

  if ( _socket !== null ) {

    var cmd = 'letsromaji ' + req.query.word;

    exec( cmd, { timeout: 10000}, function( error, stdout, stderr ) {
      console.log( stdout );
      socket.emit( stdout.replace( /\n/ig, '' ), '/dev/null' );
      res.send( stdout );
    });

  } else {
    
    res.send( 'no connction.' );
  }
});
