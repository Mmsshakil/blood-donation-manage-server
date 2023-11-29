const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;



// middleware
app.use(cors());
app.use(express.json());



const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.VITE_MONGO_USER}:${process.env.VITE_MONGO_PASS}@cluster0.ernuycp.mongodb.net/?retryWrites=true&w=majority`;

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

        const userCollection = client.db('bloodDB').collection("users");
        const upazilasCollection = client.db('bloodDB').collection("upazilas");
        const districtsCollection = client.db('bloodDB').collection("districts");

        // ------------location related api-------------------
        app.get('/upazilas', async(req, res) =>{
            const result = await upazilasCollection.find().toArray();
            res.send(result);
        })
        app.get('/districts', async(req, res) =>{
            const result = await districtsCollection.find().toArray();
            res.send(result);
        })


        // ---------------------------------------------------

        //---------------- user related api ------------------

        // user added to the database
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await userCollection.insertOne(user);
            res.send(result);

        })

        // get one user by email
        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // get one user by id for update
        app.get('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await userCollection.findOne(query);
            res.send(result);
        })

        // --------------------------------














        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('donor is running');
})

app.listen(port, () => {
    console.log(`Donner server is running on port ${port}`);
})

