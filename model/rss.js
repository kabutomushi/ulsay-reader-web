var redis = require( 'redis' ),
client = redis.createClient();

module.exports = (function() {
  return {
    addList: function( res, url ) {

      var value = [];

      if ( !url ) {
        res.send( { msg: 'error' } );
      }

      client.get( 'rssList', function( err, data ) {

        if ( data ) {
          value = JSON.parse( data );
        }

        if ( value.indexOf( url ) !== -1 ) {
          res.send( { msg: 'this url is already exists.'} );
        } else {

          value.push( url );

          client.set( 'rssList', JSON.stringify( value ) );  

          res.send( { msg: 'ok' } );
        }
      } );

    },
    removeList: function( res, url ) {
      var value = [];

      if ( !url ) {
        res.send( { msg: 'error' } );
      }

      client.get( 'rssList', function( err, data ) {

        if ( data ) {

          value = JSON.parse( data );

          if ( value.indexOf( url ) === -1 ) {

            res.send( { msg: 'this url is not exists.'} );

          } else {

            value.splice( value.indexOf( url ), 1 );

            client.set( 'rssList', JSON.stringify( value ) );

            res.send( { msg: 'ok' } );
          }
        } else {

          res.send( { msg: 'rss list is empty' } );
        }

      } );
    },
    getRssUrlList: function(callback) {
      client.get('rssList', function(err, data) {
        callback(JSON.parse(data));
      });
    }
  }
})();