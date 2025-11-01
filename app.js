const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
app.use(cookieParser());
const helmet = require('helmet');
const cors = require('cors');
app.use(express.static('public'));
app.get('/hellow', (req, res) => {
    console.log(req.ip);
});
app.use(
    cors({
        origin: ['http://localhost:3000', process.env.SITE_URL]
    }),
);

app.use([express.json(), express.urlencoded({ extended: true }), helmet()]);
app.set('view engine', 'ejs');

module.exports = {
    app,
};
