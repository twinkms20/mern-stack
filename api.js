const express = require("express");
const dbConnect = require("./mongodb");
const { ObjectId } = require("mongodb");

const app = express();

app.use(express.json());

app.get("/", async (req, resp) => {
  const db = await dbConnect();
  let data = await db.find({}).toArray();
  console.log(data);
  resp.send(data);
});

app.post("/", async (req, resp) => {
  const db = await dbConnect();
  let data = await db.insertOne(req.body);
  resp.send(data);
});

app.put("/:name", async (req, resp) => {
  const db = await dbConnect();
  let data = await db.updateOne({ name: req.params.name }, { $set: req.body });
  resp.send(data);
});

app.delete("/:id", async (req, resp) => {
  const db = await dbConnect();
  let data = await db.deleteOne({ _id: new ObjectId(req.params.id) });
  if (data.acknowledged) {
    resp.send({ msg: "Deleted Successfully", data: data });
  } else {
    resp.send("Something wrong");
  }
});

app.listen(9000);
