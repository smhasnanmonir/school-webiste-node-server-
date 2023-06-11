const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();

app.get("/", (req, res) => {
  res.send("Boss is sitting");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pyqmcvy.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const classCollection = client
      .db("summerSchool")
      .collection("classCollection");

    const teacherCollection = client
      .db("summerSchool")
      .collection("teacherCollection");

    const usersCollection = client
      .db("summerSchool")
      .collection("usersCollection");
    //get class collection from database
    app.get("/classes", async (req, res) => {
      const classes = await classCollection.find().toArray();
      res.send(classes);
    });
    //get instructors from database
    app.get("/instructors", async (req, res) => {
      const classes = await teacherCollection.find().toArray();
      res.send(classes);
    });
    //get user from database
    app.get("/users", async (req, res) => {
      const classes = await teacherCollection.find().toArray();
      res.send(classes);
    });
    //add user in database
    app.post("/users", async (req, res) => {
      const user = req.body;
      const query = { email: user.email };
      const oldUser = await usersCollection.findOne(query);
      if (oldUser) {
        return;
      }
      const newUser = await usersCollection.insertOne(user);
      res.send(newUser);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
