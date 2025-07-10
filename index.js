const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require("body-parser");
require('dotenv').config()

app.use(cors())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


const users = [];
class User {
  constructor(username) {
    this._id = users.length + 1;
    this.username = username;
    this.log = [];
    this.count = 0;
  }
}

class Exercise {
  constructor(description, duration, date) {
    this.description = description;
    this.duration = duration;
    this.date = new Date(date).toDateString();
  }
}

app.route("/api/users")
  .post((req, res) => {
    const newUser = new User(req.body.username);
    
    users.push(newUser);    
    res.json(newUser);
  })
  .get((req, res) => {
    res.json(users);
  });

app.route("/api/users/:_id/exercises")
  .post((req, res) => {
    const idToFind = Number(req.params._id);
    const user = users.find(u => u._id === idToFind);
    
    let [description, duration, date] = [req.body.description, req.body.duration, req.body.date]
    if (!date) {
      date = Date.now();
    }
    
    const newExercise = new Exercise(description, Number(duration), date);
    
    user.log.push(newExercise);
    user.count += 1;
    res.json(user);
  });

app.route("/api/users/:_id/logs")
  .get((req, res) => {
    const idToFind = Number(req.params._id);
    const user = users.find(u => u._id === idToFind);

    res.json(user);
  });

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
