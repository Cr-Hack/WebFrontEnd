const express = require('express')
const app = express()
const cors = require('cors')

/*const https = require("https");
const fs = require('fs');
const options = {
    key:fs.readFileSync('../localhost-key.pem'),
    cert:fs.readFileSync('../localhost.pem'),
}

https.createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("hello world\n");
}).listen(8080);*/

app.use(cors())

