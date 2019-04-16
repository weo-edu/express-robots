var fs = require('fs');
var asArray = require('as-array');

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

module.exports = function (robots) {
  var app = require('express')();

  if (robots) {
    robots = 'string' === typeof robots
      ? fs.readFileSync(robots, 'utf8')
      : render(robots);
  } else
    robots = '';

  app.get('/robots.txt', function(req, res) {
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  });

  return app;
};

function render(robots) {
   return asArray(robots).map(function(robot) {
    var userAgentArray = [];
    var siteMapArray = [];
    var disallowArray = asArray(robot.Disallow)
      .map(function(disallow) {
        if (Array.isArray(disallow)) {
          return disallow.map(function(line) {
            return 'Disallow: ' + line;
          }).join('\n');
        }
        return 'Disallow: ' + disallow;
      });
   
    if (Array.isArray(robot.UserAgent)) {
      userAgentArray = robot.UserAgent.map(function(userAgent) {
        return 'User-agent: ' + userAgent
      });
    } else {
      userAgentArray.push('User-agent: ' + robot.UserAgent);
    }
    if (robot.CrawlDelay) {
      userAgentArray.push('Crawl-delay: ' + robot.CrawlDelay);
    }

    if (robot.Sitemap) {
      if (Array.isArray(robot.Sitemap)) {
        siteMapArray = robot.Sitemap.map(function(siteMap) {
          return 'Sitemap: ' + siteMap;
        });
      } else {
        siteMapArray.push('Sitemap: ' + robot.Sitemap);
      }
    }

    return userAgentArray.concat(disallowArray, siteMapArray).join('\n');
  }).join('\n');
}

