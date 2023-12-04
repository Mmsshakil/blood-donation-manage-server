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
        // await client.connect();

        const userCollection = client.db('bloodDB').collection("users");
        const upazilasCollection = client.db('bloodDB').collection("upazilas");
        const districtsCollection = client.db('bloodDB').collection("districts");
        const donationRequestCollection = client.db('bloodDB').collection("donationRequests");
        const blogsCollection = client.db('bloodDB').collection("blogs");

        // ------------location related api-------------------
        app.get('/upazilas', async (req, res) => {
            const result = await upazilasCollection.find().toArray();
            res.send(result);
        })
        app.get('/districts', async (req, res) => {
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

        // get one user by email for profile
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

        // update one user by id
        app.put('/user/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedUser = req.body;
            const user = {
                $set: {
                    name: updatedUser.name,
                    blodGroup: updatedUser.blodGroup,
                    district: updatedUser.district,
                    upazila: updatedUser.upazila,
                    photoURL: updatedUser.photoURL
                }
            }

            const result = await userCollection.updateOne(query, user, options);
            res.send(result);
        })

        // get all useres
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        })

        // make admin from donor or volunter api
        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // make donor from admin
        app.patch('/users/donor/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: 'donor'
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc);
            res.send(result);
        })


        // make volunteer from donor 
        app.patch('/users/volunteer/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    role: 'volunteer'
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // make status blocked from active
        app.patch('/users/block/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: 'blocked'
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc);
            res.send(result);
        })

        // make status unblocked from block
        app.patch('/users/active/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const updatedDoc = {
                $set: {
                    status: 'active'
                }
            }
            const result = await userCollection.updateOne(query, updatedDoc);
            res.send(result);
        })


        // --------------------------------


        //------ donation realted api-------


        // donation request added to the database
        app.post('/donationRequests', async (req, res) => {
            const user = req.body;
            const result = await donationRequestCollection.insertOne(user);
            res.send(result);
        })

        // show all requests
        app.get('/requests', async (req, res) => {
            const result = await donationRequestCollection.find().toArray();
            res.send(result);
        })

        // show all requests for one user
        app.get('/myRequest', async (req, res) => {
            const email = req.query.email;
            const query = { requesterEmail: email };
            const result = await donationRequestCollection.find(query).toArray();
            res.send(result);
        })

        // delete donation request
        app.delete('/myRequest/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await donationRequestCollection.deleteOne(query);
            res.send(result);
        })

        // get one donation request by id for update
        app.get('/requests/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await donationRequestCollection.findOne(query);
            res.send(result);
        })

        // update one request by id
        app.put('/request/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateRequest = req.body;
            const request = {
                $set: {
                    // name: updatedUser.name,
                    recipientName: updateRequest.recipientName,
                    hospitalName: updateRequest.hospitalName,
                    district: updateRequest.district,
                    upazila: updateRequest.upazila,
                    fullAddress: updateRequest.fullAddress,
                    date: updateRequest.date,
                    time: updateRequest.time,
                    requestMessage: updateRequest.requestMessage
                }
            }

            const result = await donationRequestCollection.updateOne(query, request, options);
            res.send(result);
        })

        // update donation status pending to inprogress 
        // add donar name and email also
        app.put('/donationConfirm/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateRequest = req.body;
            const request = {
                $set: {
                    // name: updatedUser.name,
                    donarName: updateRequest.donarName,
                    donarEmail: updateRequest.donarEmail,
                    donationStatus: updateRequest.donationStatus
                }
            }

            const result = await donationRequestCollection.updateOne(query, request, options);
            res.send(result);
        })

        // update donation status done / cancel
        app.put('/statusUpdate/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const statusUpdate = req.body;
            const request = {
                $set: {
                    donationStatus: statusUpdate.donationStatus
                }
            }

            const result = await donationRequestCollection.updateOne(query, request, options);
            res.send(result);
        })

        // statistics for admin and volunter
        app.get('/adminStatistic', async (req, res) => {
            const users = await userCollection.estimatedDocumentCount();
            const requests = await donationRequestCollection.estimatedDocumentCount();

            res.send({
                users,
                requests
            })
        })


        // --------------blog realated api ------------------------

        // create a blog
        app.post('/blogs', async (req, res) => {
            const blog = req.body;
            const result = await blogsCollection.insertOne(blog);
            res.send(result);

        })

        // get all blogs
        app.get('/blogs', async (req, res) => {
            const result = await blogsCollection.find().toArray();
            res.send(result);
        })

        // delete a blog
        app.delete('/blogs/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await blogsCollection.deleteOne(query);
            res.send(result);
        })









        // -------------------------------------------------------

        // Send a ping to confirm a successful connection
        // await client.db("admin").command({ ping: 1 });
        // console.log("Pinged your deployment. You successfully connected to MongoDB!");
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

