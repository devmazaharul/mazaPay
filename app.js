const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const helmet = require('helmet');
const cors = require('cors');
app.use(express.static('public'));
app.use(
  cors({
    origin: 'https://pay.mazaharul.site',
    credentials: true,
  })
);
app.use([express.json(), express.urlencoded({ extended: true }), helmet()]);
app.set('view engine', 'ejs');

app.get('/api', (_req, res) => {
  res
    .status(200)
    .json({ message: 'Welcome to the MazaPay App API', status: 200 });
});

app.disable('x-powerd-by');

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to maza secure pay',
  });
});

module.exports = {
  app,
};
