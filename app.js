const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const helmet = require('helmet');
const cors = require('cors');
app.use(express.static('public'));
app.use(
  cors({
    origin: 'localhost',
    credentials: true,
  })
);
app.use([express.json(), express.urlencoded({ extended: true }), helmet()]);
app.set('view engine', 'ejs');

module.exports = {
  app,
};
