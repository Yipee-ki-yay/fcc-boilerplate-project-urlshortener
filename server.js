require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { URL, parse }  = require("url");
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Basic Configuration
const port = process.env.PORT || 3000;
const shortUrls = []

const stringIsAValidUrl = (s) => {
  const protocols = ['http', 'https']
  try {
      new URL(s);
      const parsed = parse(s);
      return protocols
          ? parsed.protocol
              ? protocols.map(x => `${x.toLowerCase()}:`).includes(parsed.protocol)
              : false
          : true;
  } catch (err) {
      return false;
  }
};


app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', function(req, res) {
  const original_url = req.body.url

  if(!stringIsAValidUrl(original_url)) {
    return res.json({ error: 'invalid url' })
  }

  shortUrls.push(original_url)
  const short_url = shortUrls.length - 1

  res.json({
    original_url,
    short_url
  });
})

app.get('/api/shorturl/:idx', function(req, res) {
  const { idx } = req.params
  const fullUrl = shortUrls[idx]

  console.log('fullUrl', fullUrl);
  res.redirect(fullUrl);
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
