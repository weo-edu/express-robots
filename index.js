var fs = require('fs');
var asArray = require('as-array');

module.exports = function(robots) {
  var app = require('express')();

  if(robots) {
    robots = 'string' === typeof robots
      ? fs.readFileSync(robots, 'utf8')
      : render(robots);
  } else
    robots = '';

  app.get('/robots.txt', function(req, res) {
    res.send(robots);
  });

  return app;
};

function render(robots) {
  return asArray(robots).map(function(robot) {
    // console.log('test', [robot.UserAgent].concat(asArray(robot.Disallow)) );
    return ['UserAgent: ' + robot.UserAgent].concat(asArray(robot.Disallow).map(function(disallow) {
      return 'Disallow: ' + disallow;
    })).join('\n');
  }).join('\n');
}