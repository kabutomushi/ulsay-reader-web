
/*
 * GET ulsay listing.
 */

var FeedParser = require('feedparser')
    , request = require('request');

exports.init = function ( req, res ) {

  res.render( 'init', { title: 'Ulsay' } );

}

/**
 * RSSを取得して返す
 **/
exports.fetchRss = function( req, res ) {

  //var url = 'http://rss.dailynews.yahoo.co.jp/fc/rss.xml',
  var url = 'http://wired.jp/rssfeeder/',
  rssreq = request( url ),
  feedparser = new FeedParser(),
  item = [],
  RSSItem = function( item ) {
    this.title = item.title;
    this.summary = item.summary;
    this.description = item.description.replace(/(<([^>]+)>)|\n/ig, "");
    this.link = item.link;
    if ( typeof item['rss:image'] !== 'undefined' ) {
      this.imgUrl = item['rss:image']['#'];
    }
  };

  rssreq.on('response', function( res ) {

    var stream = this;

    if ( res.statusCode != 200 ) {
      return this.emit( 'error', new Error( 'Bad status code' ) );
    }

    stream.pipe( feedparser );
  });

  feedparser.on( 'readable', function() {

    var stream = this,
      meta = this.meta, // **NOTE** the "meta" is always available in the context of the feedparser instance
      _item;

    while ( _item = stream.read() ) {
      
      console.log(_item);
      item.push( new RSSItem( _item ) );
    }

    stream.end = function() {
      res.writeHead( 200, {
        'Content-Type':'application/json; charset=utf-8',
        'Access-Control-Allow-Origin':'*',
        'Pragma': 'no-cache',
        'Cache-Control' : 'no-cache'
      });

      res.write( JSON.stringify( item ) );
      res.end();                  
    };
  });

};
