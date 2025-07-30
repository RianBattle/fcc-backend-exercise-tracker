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
  },
  user_id: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);
const LogEntry = mongoose.model("LogEntry", logEntrySchema);

const DATE_REGEX = /[\d]{4}-[\d]{2}-[\d]{2}/;

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
  .post(async (req, res) => {
    const id = req.params._id;
    const description = req.body.description;
    const duration = req.body.duration;

    const dateInput = req.body.date;
    let date = undefined;
    if (DATE_REGEX.test(dateInput)) {
      date = new Date(dateInput);
    }
    else {
      date = new Date();
    }

    const user = await User.findById(id);

    const newLogEntry = new LogEntry({
      description: description,
      duration: duration,
      date: date,
      user_id: id
    });
    await newLogEntry.save();

    res.json({
      _id: user._id,
      username: user.username,
      description: newLogEntry.description,
      duration: newLogEntry.duration,
      date: newLogEntry.date
    });
  });

app.route("/api/users/:_id/logs")
  .get(async (req, res) => {
    const id = req.params._id;

    const from = req.query.from ? new Date(req.query.from) : null;
    const to = req.query.to ? new Date(req.query.to) : null;
    const limit = parseInt(req.query.limit) || 0;
    
    const user = await User.findById(id);
    const logs = await LogEntry.find({ user_id: user._id });

    let filteredLogs = logs;
    if (from) {
      console.log("from:", from);
      filteredLogs = filteredLogs.filter(l => new Date(l.date) >= from);
      console.log(filteredLogs);
    }
    if (to) {
      filteredLogs = filteredLogs.filter(l => new Date(l.date) <= to);
    }
    if (limit > 0) {
      filteredLogs = filteredLogs.slice(0, limit);
    }

    res.json({
      _id: user._id,
      username: user.username,
      count: logs.length,
      log: filteredLogs.map(l => ({
        description: l.description,
        duration: l.duration,
        date: new Date(l.date).toDateString()
      }))
    });
  })

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
