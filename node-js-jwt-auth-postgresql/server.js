const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')

const app = express()

let corsOptions = {
    origin: 'http://localhost:8081'
}

app.use(cors(corsOptions))

app.use(bodyParser.json())

app.use(bodyParser.urlencoded({ extended: true}))

app.get('/', (req, res) => {
    res.json({message: 'Welcome in the Froum app'})
})
require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);

const dbConfig = require("./config/mongo.config");
const db = require('./models')
const Role = db.role

db.mongoose
    .connect(`mongodb://${dbConfig.HOST}:${dbConfig.PORT}/${dbConfig.DB}`, {
        useNewUrlParser : true,
        useUnifiedTopology: true
    })
    .then(() =>{
        console.log('Connection to the db has been done')
        initial()
    })
    .catch(err => {
        console.log('Connection Error', err)
        process.exit()
    })


function initial(){
    Role.estimatedDocumentCount((err, count) => {
        if(!err && count === 0){
            new Role({
                name: 'user'
            }).save(err => {
                if(err){
                    console.log('error', err)
                }
                console.log('added user to roles collections')
            })
            new Role({
                name: 'moderator'
            }).save(err => {
                if(err){
                    console.log('error', err)
                }
                console.log('added  to roles collections')
            })
            new Role({
                name: 'admin'
            }).save(err => {
                if(err){
                    console.log('error', err)
                }
                console.log('added admin to roles collections')
            })
        }
        

        console.log()
    })
}


const PORT = process.env.PORT || 8080
app.listen(PORT, () => {
    console.log('The server is running on local port 8080')
})