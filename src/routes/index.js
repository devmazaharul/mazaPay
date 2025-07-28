const accountRoute = require('./account');
const apiRoute = require('./api');
const payRoute = require('./pay');
const app = require('express').Router();

app.get('/api', (_req, res) => {
  res
    .status(200)
    .json({ message: 'Welcome to the MazaPay App API', status: 200 });
});

app.use(accountRoute);
app.use(apiRoute);
app.use('/pay', payRoute);

module.exports = app;
