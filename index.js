const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const cors = require("cors");
app.use(cors());
app.use(express.json());
require("dotenv").config();
const stripe = require("stripe")(
  "sk_test_51NGwcgK1rPsA3dPJv7Q6l68B6d94IdTLsCNMEmYn6X3WiTcE8BaomRzVT1UgNq1IaejMwYf2j50nYljZBwYosOp000ylXdXmON"
);
app.get("/", (req, res) => {
  res.send("Boss is sitting");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
    const cartCollection = client
      .db("summerSchool")
      .collection("cartCollection");
    const paymentCollection = client
      .db("summerSchool")
      .collection("paymentCollection");
    //get class collection from database
    app.get("/classes", async (req, res) => {
      const classes = await classCollection.find().toArray();
      res.send(classes);
    });

    //get instructors class from class collection
    app.get("/classes/email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await classCollection.find(query).toArray();
      res.send(result);
    });

    //delete
    app.delete("/classes/email:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.deleteOne(query);
      res.send(result);
    });
    //get by id
    app.get("/classes/email:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.findOne(query);
      res.send(result);
    });
    //update
    app.put("/classes/email:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedClass = req.body;
      const setUpdatedClass = {
        $set: {
          students: updatedClass.students,
          price: updatedClass.price,
        },
      };
      const result = await classCollection.updateOne(
        query,
        setUpdatedClass,
        options
      );
      res.send(result);
    });

    //get classes by id
    app.get("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await classCollection.findOne(query);
      res.send(result);
    });

    //post a class
    app.post("/classes", async (req, res) => {
      const items = req.body;
      const result = await classCollection.insertOne(items);
      res.send(result);
    });

    //status update class
    app.put("/classes/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedClass = req.body;
      const setUpdatedClass = {
        $set: {
          status: updatedClass.status,
          feedback: updatedClass.feedback,
        },
      };
      const result = await classCollection.updateOne(
        query,
        setUpdatedClass,
        options
      );
      res.send(result);
    });

    //get instructors from database
    app.get("/instructors", async (req, res) => {
      const classes = await teacherCollection.find().toArray();
      res.send(classes);
    });

    //get user from their id
    app.get("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    //get user from database
    app.get("/users", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    app.get("/allUsers", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    app.get("/allUsers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    //update user role

    app.put("/allUsers/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedRole = req.body;
      const setUpdatedRole = {
        $set: {
          role: updatedRole.role,
        },
      };
      const result = await usersCollection.updateOne(
        query,
        setUpdatedRole,
        options
      );
      res.send(result);
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
    //cart related api
    // get cart data from database
    app.get("/carts", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await cartCollection.find(query).toArray();
      res.send(result);
    });
    // add product to cart collection
    app.post("/carts", async (req, res) => {
      const items = req.body;
      const result = await cartCollection.insertOne(items);
      res.send(result);
    });
    // delete from cart collection
    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      res.send(result);
    });

    //paymet related
    app.post("/create-payment-intent", async (req, res) => {
      const { price } = req.body;
      const amount = parseInt(price * 100);
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: "usd",
        payment_method_types: ["card"],
      });

      res.send({
        clientSecret: paymentIntent.client_secret,
      });
    });
    app.get("/payment", async (req, res) => {
      const result = await paymentCollection.find().toArray();
      res.send(result);
    });
    app.get("/payment/email", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await paymentCollection.find(query).toArray();
      res.send(result);
    });
    app.post("/payments", async (req, res) => {
      const payment = req.body;
      const insertResult = await paymentCollection.insertOne(payment);

      const query = {
        _id: { $in: payment.cartItems.map((id) => new ObjectId(id)) },
      };
      const deleteResult = await cartCollection.deleteMany(query);

      res.send({ insertResult, deleteResult });
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);
