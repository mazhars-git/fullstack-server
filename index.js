const express = require('express')
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.cpoqr.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json())
app.use(cors()) 
app.use(fileUpload())


const port = 4000
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });




client.connect(err => {
  const collection = client.db("myCompany").collection("employees");
  
  app.post('/addEmployee', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    const file = req.files.file;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    }
    
    collection.insertOne({name, email, phone, image})
    .then(result => {
      console.log(result)
      res.send(result.insertedCount > 0)
    })
  })

  app.get('/employees', (req, res) =>{
    collection.find({})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })


  console.log("Database Connected");
});







app.listen(process.env.PORT || port);