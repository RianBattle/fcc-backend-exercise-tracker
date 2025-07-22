const express = require('express')
const app = express()
const cors = require('cors')
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require('dotenv').config()

mongoose.connect(process.env.MONGO_URI);

app.use(cors());
app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: "false" }));
app.use(bodyParser.json());

let lastUserId = 0;
const userSchema = new mongoose.Schema({
  _id: Number,
  username: {
    type: String,
    required: true
  }
});

let User = mongoose.model("User", userSchema);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.route("/api/users")
  .post(async (req, res) => {
    const username = req.body.username;
    
    try {
      const newUser = new User({_id: ++lastUserId, username: username });
      const savedUser = await newUser.save();
      res.json({
        _id: savedUser._id,
        username: savedUser.username
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Error creating user" });
    }
  })
  .get(async (req, res) => {
    try {
      const users = await User.find({}, "username _id");
      res.json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Error fetching users" });
    }
  });

app.post("/api/users/:_id/exercises", (req, res) => {
  //
});

app.get("/api/users/:_id/logs", (req, res) => {
  //
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
});
