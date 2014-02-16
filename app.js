
/**
 * Module dependencies.
 */

var express = require( 'express' );
var routes = require( './routes' );
var user = require( './routes/user' );
var ulsay = require( './routes/ulsay' );
var http = require( 'http' );
var path = require( 'path' );
var exec = require( 'child_process' ).exec;
var rss = require( './model/rss.js' );

var redis = require( 'redis' ),
client = redis.createClient();

var app = express();

// all environments
app.set( 'port', process.env.PORT || 3000 );
app.set( 'views', path.join(__dirname, 'views' ) );
app.set( 'view engine', 'ejs' );
app.use( express.favicon() );
app.use( express.logger('dev') );
app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.methodOverride() );
app.use( express.cookieParser( 'your secret here' ) );
app.use( express.session() );
app.use( app.router );
app.use( express.static( path.join( __dirname, 'public' ) ) );

// development only
if ( 'development' == app.get( 'env' ) ) {
  app.use( express.errorHandler() );
}

var server = http.createServer( app ).listen( app.get( 'port' ), function() {
  console.log( "Express server listening on port " + app.get( 'port' ) );
} );

var io = require( 'socket.io' ).listen( server ),
_socket = null;

io.sockets.on( 'connection', function( socket ) {

  _socket = socket;

});

// ulsayメイン
app.get( '/ulsay', ulsay.init );

// rssソース追加
app.get( '/addRss', function( req, res ) {

  rss.addList( res, req.query.url );

} );

// rssソース削除
app.get( '/removeRss', function( req, res ) {

  rss.removeList( res, req.query.url );

} );

// rssソースのリストを取得
app.get('/fetchList', function( req, res ) {

  rss.getRssUrlList(function(data) {

    res.send(data);
  });

});

// rss情報の取得
app.get( '/fetchRss', ulsay.fetchRss );

// ローマ字変換したデータをwebsoketで送信
app.post( '/sendSay',  function( req, res ) {

  if ( _socket !== null ) {

    var word = req.body.word;

    if ( typeof word === 'undefined' ) {
        res.send( { msg: 'error: word undefined' } );
    }

    var cmd = 'letsromaji ' + req.body.word;

    exec( cmd, { timeout: 10000 }, function( error, stdout, stderr ) {

      console.log( stdout );

      _socket.emit( 'say', stdout.replace( /\n/ig, '' ) );

      res.send( stdout );
    });

  } else {

    res.send( { msg: 'no connction.' } );
  }
});
