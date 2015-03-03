# express-robots

Express middleware for generating a robots.txt or responding with an existing file.

## Using a file

```javascript
app.use(robots(__dirname + '/robots.txt'));
```

## Using an object

```javascript
app.use(robots({UserAgent: '*', Disallow: '/'}))
```

Or

```javascript
app.use(robots([
  {
    UserAgent: 'Googlebot',
    Disallow: '/nogoogle'
  },
  {
    UserAgent: 'Bingbot',
    Disallow: '/nobing'
  }
]));
```