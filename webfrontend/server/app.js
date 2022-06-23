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
]

app.use(cors())

app.get('/', function(req, res){
    res.send(db)
})


app.listen(3000, function(){
    console.log('Example app listening on port 3000!')
})
