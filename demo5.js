const express = require("express");
const EventEmmiter = require("events");

const app = express();

const event = new EventEmmiter();

let count = 0;

event.on("countAPI", () => {
  count++;
  console.log("event calling", count);
});

app.get("/", (req, res) => {
  res.send("called");
  event.emit("countAPI");
});

app.get("/search", (req, res) => {
  res.send("search called");
  event.emit("countAPI");
});

app.get("/upload", (req, res) => {
  res.send("upload called");
  event.emit("countAPI");
});

app.listen(9000);
