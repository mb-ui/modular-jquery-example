const express = require('express')
    , path = require('path')
    , app = express()
    , port = 8083;
app.use(express.static(path.join(__dirname, 'public')))
    .get('/', (req, res) => {
        res.sendfile('./public/index.html');
    }).listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
    });
module.exports = app;