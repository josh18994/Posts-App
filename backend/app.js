const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const postsRoutes = require("./routes/posts");
const userRoutes = require('./routes/user');


const app = express();
const connectionLink = `mongodb+srv://joshua:${process.env.MONGO_ATLAS}@cluster0.huuxj.mongodb.net/node?retryWrites=true&w=majority`;

mongoose
  .connect(connectionLink)
  .then(() => {
    console.log("connected to database!");
  })
  .catch(() => {
    console.log("connection failed");
  });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});


module.exports = app;

app.use('/posts', postsRoutes);

app.use('/user', userRoutes);