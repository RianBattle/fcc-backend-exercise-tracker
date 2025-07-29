const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

class User {
  static nextId = 1;
  constructor(username) {
    this._id = User.nextId;
    User.nextId += 1;

    this.username = username;
    console.log("username:", username);
    this.log = [];
  }
}

class LogEntry {
  constructor(description, duration, date) {
    this.description = description;
    this.duration = duration;
    this.date = date;
  }
}

const users = [];

app.route("/api/users")
  .get((req, res) => {
    const output = users.map(u => ({
      _id: u._id,
      username: u.username
    }));
    console.log(output);
    res.json(output);
  })
  .post((req, res) => {
    const newUser = new User(req.body.username);
    users.push(newUser);
    res.json({
      _id: newUser._id,
      username: newUser.username
    });
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
