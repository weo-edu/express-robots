var fs = require('fs');
var asArray = require('as-array');

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

module.exports = function(robots) {
  var app = require('express')();

  if(robots) {
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
  var SitemapArray = []
  var robots = asArray(robots).map(function(robot) {
    var userAgentArray = [];
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
      SitemapArray = SitemapArray.concat(robot.Sitemap)
    }

    return userAgentArray.concat(asArray(robot.Disallow).map(function(disallow) {
      if (Array.isArray(disallow)) {
        return disallow.map(function(line) {
          return 'Disallow: ' + line;
        }).join('\n');
      }
      return 'Disallow: ' + disallow;
    })).join('\n');
  }).join('\n')

  if (SitemapArray.length > 0) {
    robots += '\n' + SitemapArray.map(function(sitemap) { return 'Sitemap: ' + sitemap }).join('\n');
  }

  return robots;
}
