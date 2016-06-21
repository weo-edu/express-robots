var fs = require('fs');
var asArray = require('as-array');

if (!Array.isArray) {
  Array.isArray = function(arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

module.exports = function(robots) {
  return function middleware(req, res, next) {
    if (req.url.toLowerCase() !== '/robots.txt') {
      next();
      return;
    }
    
    if(robots) {
      robots = 'string' === typeof robots
        ? fs.readFileSync(robots, 'utf8')
        : render(robots);
    } else {
      robots = '';
    }
    
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  }
};

function render(robots) {
  return asArray(robots).map(function(robot) {
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
    return userAgentArray.concat(asArray(robot.Disallow).map(function(disallow) {
      if (Array.isArray(disallow)) {
        return disallow.map(function(line) {
          return 'Disallow: ' + line;
        }).join('\n');
      }
      return 'Disallow: ' + disallow;
    })).join('\n');
  }).join('\n');
}
