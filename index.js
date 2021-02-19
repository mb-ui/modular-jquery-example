const open = require('open')
    , express = require('express')
    , path = require('path')
    , app = express()
    , port = 5000;
app.use(express.static(path.join(__dirname, 'public')))
    .get('/', (req, res) => {
        res.sendfile('./public/index.html');
    }).listen(port, () => {
        console.log(`Example app listening at http://localhost:${port}`);
        (async () => {
            await open(`http://localhost:${port}`);
        })();
    });
module.exports = app;