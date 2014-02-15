
/*
 * GET ulsay listing.
 */

var FeedParser = require('feedparser'),
request = require('request'),
rss = require('../model/rss.js');

exports.init = function ( req, res ) {

  res.render( 'init', { title: 'Ulsay' } );
}

/**
 * RSSを取得して返す
 **/
exports.fetchRss = function( req, res ) {

  var urlList = [],
  RSSItem = function( item ) {
    this.title = item.title;
    this.summary = item.summary;
    this.description = item.description.replace(/(<([^>]+)>)|\n/ig, "");
    this.link = item.link;
    if ( typeof item['rss:image'] !== 'undefined' ) {
      this.imgUrl = item['rss:image']['#'];
    }
  },
  item = [];

  var _request = function( item, index) {

    request( urlList[ index ], function( err, response, body) {
      console.log(err);
        if (!err && response.statusCode == 200) {
          var json = JSON.parse( require( 'xml2json' ).toJson( body ) ),
          items = json.rss.channel.item;

          item[index] = [];
          for ( var i in items ) {

            item[index].push( new RSSItem( items[i] ) );

          }
        }

        if ( index === 0 ) {
          res.send(_mix(item));
        } else {
          _request( item, index - 1 );
        }

      });
  };

  rss.getRssUrlList(function( data ) {
    urlList = data;
    _request( item, urlList.length - 1 );
  });

  var _mix = function(item) {
    var rss = [];
    var sourceNum = item.length;
    var b = sourceNum;

    while(1) {

      // 全てのソースのitemが0になるまで続ける
      if (b === 0) {
        break;
      }

      for (var i = 0; i < sourceNum; i++) {

        var a = item[i].splice( _rand(0, item[i].length), 1 );

        if ( a.length !== 0 ) {
          rss.push(a[0]);
        } else {
          b--;
        }
      }  
    }

    return rss;

  };

  var _rand = function(low, high) {
    return ~~(Math.random() * (high - low) + low);
  };

};
