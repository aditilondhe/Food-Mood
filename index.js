
const express = require('express')
const app = express();
const cors =require('cors')
const port = process.env.PORT || 6001;
require('dotenv').config()



//middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})


//mongodb config 

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@demo-foodmood-cluster.rl4o3.mongodb.net/?retryWrites=true&w=majority&appName=demo-foodmood-cluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    
    //database and collections
    const menuCollections =client.db("demo-foodmood-client").collection("menus");
    const cartCollections=client.db("demo-foodmood-client").collection("cartItems");

 //all cart operations 
 //posting cart to db
    app.post('/carts',async(req,res)=>{
      const cartItem=req.body;
      const result=await cartCollections.insertOne(cartItem);
      res.send(result);

    })


    //get carts using email
    app.get('/carts',async(req,res)=>{
      const email=req.query.email;
      const filter={email:email}
      const result=await cartCollections.find(filter).toArray();
      res.send(result);

    })

    app.get('/carts', async (req, res) => {
      try {
          const result = await cartCollections.find().toArray();
          res.json(result);
      } catch (error) {
          res.status(500).json({ error: "Internal Server Error" });
      }
  });
  
  
    //all menu items operations
    app.get('/menu',async(req,res)=>
    {
      const result=await menuCollections.find().toArray();
      res.send(result)
    }) 
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})