
/*
 * GET ulsay listing.
 */

exports.init = function( req, res ) {
  res.render( 'init', { title: 'Ulsay' } );
}

exports.fetchRss = function( req, res ) {

  var RSS = function() {
    this.title = '';
    this.content = '';
    this.description = '';
    this.thumb ='';
  }

  var rssData = { 'title' : 'test' };

  res.send( rssData );
};
