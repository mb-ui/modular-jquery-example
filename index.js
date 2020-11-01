var express = require('express')
    , path = require('path')
    , app = express();
app.use(express.static(path.join(__dirname, 'public')))
    .get('/', (req, res) => {
        res.sendfile('./public/index.html');
    }).listen(3000);
module.exports = app;