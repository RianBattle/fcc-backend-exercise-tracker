const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose");

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  }
});

const logEntrySchema = new mongoose.Schema({
  description: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const User = mongoose.model("User", userSchema);
const LogEntry = mongoose.model("LogEntry", logEntrySchema);

app.route("/api/users")
  .get(async (req, res) => {
    const users = await User.find({}).select("_id username");
    res.json(users);
  })
  .post(async (req, res) => {
    const username = req.body.username;
    const newUser = new User({ username: username });
    await newUser.save();
    res.json({
      _id: newUser._id,
      username: newUser.username
    });
  });

app.route("/api/users/:_id/exercises")
  .post((req, res) => {
    // const id = Number(req.params._id);
    // const { description, duration, date } = req.body;
    // console.log(id, description, duration, date);
  });

app.route("/api/users/:_id/logs")
  .get((req, res) => {
    //
  })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
