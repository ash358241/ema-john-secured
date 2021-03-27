const express = require('express')
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
// console.log(process.env.DB_USER)

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.suylw.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()

app.use(bodyParser.json())
app.use(cors())

const port = 5000

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const products = client.db("emaJohnStore").collection("products");
  const orders = client.db("emaJohnStore").collection("orders");

  //adding items
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    // console.log(product);
    products.insertOne(product)
    .then(result => {
        // console.log(result.insertCount);
        res.send(result.insertCount)
    })
  })

  app.post('/addOrder', (req, res) => {
    const order = req.body;
    orders.insertOne(order)
    .then(result => {
        res.send(result.insertCount > 0)
    })
  })

  //reading items
  app.get('/products', (req, res)=>{
    products.find({})
    .toArray((err, documents) => {
        res.send(documents);
    })
})
  
  app.get('/product/:key', (req, res)=>{
      products.find({key: req.params.key})
      .toArray((err, documents) => {
          res.send(documents[0]);
      })
  })

  app.post('/productsByKeys', (req, res) => {
      const productKeys = req.body;
    products.find({key: { $in: productKeys }})
    .toArray((err, documents) => {
        res.send(documents);
    })
  })

  
});

app.get('/', (req, res) => {
    res.send('Hello World!')
  })


app.listen(process.env.PORT || PORT)