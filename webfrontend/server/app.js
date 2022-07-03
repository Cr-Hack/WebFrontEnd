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

const db = [{
            id: 0,
            de : "Moi",
            a : "Dupont",
            fichier: "ordonnance1.pdf",
            dateheure:"xxx", 
            downloadable : false
        },
        {
            id: 1,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : false
        }
        ,
        {
            id: 2,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : false
        }
        ,
        {
            id: 3,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : false
        }
        ,
        {
            id: 4,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 5,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 6,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : false
        }
        ,
        {
            id: 7,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 8,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 9,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        },
        {
            id: 0,
            de : "Moi",
            a : "Dupont",
            fichier: "ordonnance1.pdf",
            dateheure:"xxx", 
            downloadable : false
        },
        {
            id: 1,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 2,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 3,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 4,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : false
        }
        ,
        {
            id: 5,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : false
        }
        ,
        {
            id: 6,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 7,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 8,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 9,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        },
        {
            id: 0,
            de : "Moi",
            a : "Dupont",
            fichier: "ordonnance1.pdf",
            dateheure:"xxx", 
            downloadable : false
        },
        {
            id: 1,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 2,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 3,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 4,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 5,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 6,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 7,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 8,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 9,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        },
        {
            id: 0,
            de : "Moi",
            a : "Dupont",
            fichier: "ordonnance1.pdf",
            dateheure:"xxx", 
            downloadable : false
        },
        {
            id: 1,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 2,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 3,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 4,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 5,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 6,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 7,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 8,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
        ,
        {
            id: 9,
            de : "Salut",
            a : "Moi",
            fichier: "ordonnance2.pdf",
            dateheure:"xxx",
            downloadable : true
        }
]

app.use(cors())

