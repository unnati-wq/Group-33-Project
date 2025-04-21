const express = require('express');
const cors = require('cors');
const config = require('./config');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// We use express to define our various API endpoints and
// provide their handlers that we implemented in routes.js

app.get('/search_books', routes.search_books);
app.get('/top/:type', routes.top);
app.get('/profile/:type', routes.profile);
app.get('/daily/:type', routes.recommendation);
app.get('/popular_genre', routes.popular_genre);
app.get('/review/:bookId', routes.review);

app.listen(config.server_port, () => {
  console.log(`Server running at http://${config.server_host}:${config.server_port}/`)
});

module.exports = app;
