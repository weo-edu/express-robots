var fs = require('fs');
var expect = require('chai').expect;
var supertest = require('supertest');
var robots = require('../');

describe('express-robots', function() {
  it('should work', function(done) {
    var request = supertest(robots({UserAgent: '*', Disallow: '/'}));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nDisallow: /');
        done();
      });
  });
  
  it('should work with a crawl delay', function(done) {
    var request = supertest(robots({UserAgent: '*', CrawlDelay: '5'}));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nCrawl-delay: 5');
        done();
      });
  });
  
  it('should work with multiple crawl delays', function(done) {
    var request = supertest(robots([
      {UserAgent: '*', CrawlDelay: '5'}, 
      {UserAgent: 'Foo', CrawlDelay: '10'}
    ]));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nCrawl-delay: 5\nUser-agent: Foo\nCrawl-delay: 10');
        done();
      });
  });

  it('should work with files', function() {
    var request = supertest(robots(__dirname + '/fixtures/robots.txt'));
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal(fs.readFileSync(__dirname + '/fixtures/robots.txt', 'utf8'));
      });
  });

  it('should respond with an empty file if nothing is specified', function() {
    var request = supertest(robots());
    request
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('');
      });
  });

});