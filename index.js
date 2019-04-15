const fs = require('fs');
const asArray = require('as-array');

if (!Array.isArray) {
  Array.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
  };
}

module.exports = function (robots) {
  const app = require('express')();

  if (robots) {
    robots = typeof robots === 'string'
      ? fs.readFileSync(robots, 'utf8')
      : render(robots);
  } else { robots = ''; }

  app.get('/robots.txt', (req, res) => {
    res.header('Content-Type', 'text/plain');
    res.send(robots);
  });

  return app;
};

function disallowResult(Disallow) {
  return asArray(Disallow).map((disallow) => {
    if (Array.isArray(disallow)) {
      return disallow.map((line) => {
        return `Disallow: ${line}`;
      }).join('\n');
    }
    return `Disallow: ${disallow}`;
  });
}

function render(robots) {
  return asArray(robots).map((robot) => {
    let userAgentArray = [];
    let siteMapArray = [];

    if (Array.isArray(robot.UserAgent)) {
      userAgentArray = robot.UserAgent.map((userAgent) => {
        return `User-agent: ${userAgent}`;
      });
    } else {
      userAgentArray.push(`User-agent: ${robot.UserAgent}`);
    }

    if (robot.CrawlDelay) {
      userAgentArray.push(`Crawl-delay: ${robot.CrawlDelay}`);
    }

    if (Array.isArray(robot.Sitemap)) {
      siteMapArray = robot.Sitemap.map((siteMap) => {
        return `Sitemap: ${siteMap}`;
      });
    } else {
      siteMapArray.push(`Sitemap: ${robot.Sitemap}`);
    }

    return userAgentArray.concat(disallowResult(robot.Disallow), siteMapArray).join('\n');
  }).join('\n');
}

