var fs = require('fs');
var asArray = require('as-array');
var crypto = require('crypto');

module.exports = function(robots, opts) {
  var app = require('express')();

  options = options || {}
  var maxAge = options.maxAge || 86400000


  if (!robots) {
    throw new Error('No path or data provided for robots.txt file');
  }



  robots = 'string' === typeof robots
    ? fs.readFileSync(robots, 'utf8')
    : render(robots);


  app.get('/robots.txt', function(req, res) {
    var  headers = { 
      'Content-Type': 'text/plain'
      , 'Content-Length': robots.length
      , 'ETag': '"' + crypto.createHash('md5').update(robots).digest('hex') + '"'
      , 'Cache-Control': 'public, max-age=' + (maxAge / 1000)
    }

    res.writeHead(headers);
    res.end(robots);
  });

  return app;
};

function render(robots) {
  return asArray(robots).map(function(robot) {
    return ['User-agent: ' + robot.UserAgent].concat(asArray(robot.Disallow).map(function(disallow) {
      return 'Disallow: ' + disallow;
    })).join('\n');
  }).join('\n');
}