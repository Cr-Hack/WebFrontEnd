const express = require('express')
const app = express()
const cors = require('cors')

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

app.get('/', function(req, res){
    res.send(db)
})


app.listen(3000, function(){
    console.log('Example app listening on port 3000!')
})
