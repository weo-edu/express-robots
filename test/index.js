var fs = require('fs');
var expect = require('chai').expect;
var supertest = require('supertest');
var robots = require('../');
var express = require('express');
var request = require('supertest');

describe('express-robots', function() {
  var app;
  
  beforeEach(() => {
     app = new express();
  });
  
  it('should work', function(done) {
    app.use(robots({UserAgent: '*', Disallow: '/'}));

    request(app)
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nDisallow: /');
        done();
      });
  });
  
  it('should work with a crawl delay', function(done) {
    app.use(robots({UserAgent: '*', CrawlDelay: '5'}));

    request(app)
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nCrawl-delay: 5');
        done();
      });
  });
  
  it('should work with multiple crawl delays', function(done) {
    app.use(robots([
      {UserAgent: '*', CrawlDelay: '5'}, 
      {UserAgent: 'Foo', CrawlDelay: '10'}
    ]));
    
    request(app)
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.headers['content-type']).to.equal('text/plain; charset=utf-8');
        expect(res.text).to.equal('User-agent: *\nCrawl-delay: 5\nUser-agent: Foo\nCrawl-delay: 10');
        done();
      });
  });

  it('should work with files', function() {
    app.use(robots(__dirname + '/fixtures/robots.txt'));
    
    request(app)
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal(fs.readFileSync(__dirname + '/fixtures/robots.txt', 'utf8'));
      });
  });

  it('should respond with an empty file if nothing is specified', function() {
    app.use(robots());
    
    request(app)
      .get('/robots.txt')
      .end(function(err, res) {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('');
      });
  });
});
