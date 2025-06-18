const express = require('express');
const app = express();

const helmet = require('helmet');
const cors = require('cors');

app.use([express.json(), express.urlencoded({ extended: true }), helmet()]);

app.use(cors());
app.disable('x-powerd-by');
module.exports = {
  app,
};
