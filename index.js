const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/exercise-tracker-db", {})
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Error connecting to MongoDB:", err));

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
    console.log("/api/users GET");
    const users = await User.find({}).select("_id username");
    console.log("users:", users);
    res.json(users);
    console.log("/api/users GET complete")
  })
  .post(async (req, res) => {
    console.log("/api/users POST", req.body.username);
    const username = req.body.username;
    const newUser = new User({ username: username });
    console.log("newUser:", newUser);
    await newUser.save();
    console.log("newUser saved");
    res.json({
      _id: newUser._id,
      username: newUser.username
    });
    console.log("/api/users POST complete")
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
