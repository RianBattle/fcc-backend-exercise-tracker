let express = require('express');
let app = express();
let bodyParser = require("body-parser");

require("dotenv").config();

// requests for "/public" come from express.static(fullPathToDirectory)
app.use("/public", express.static(__dirname + "/public"));

// decode URL encoded POST requests
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.get("/", (req, res) => {
    // res.sendFile returns a file in the response, needs to have absolute file path
    res.sendFile(__dirname + "/views/index.html");
})

app.get("/json", (req, res) => {
    // res.json takes a json object and returns it in the response
    const message = "Hello json";
    res.json({ "message": process.env.MESSAGE_STYLE === "uppercase" ? message.toUpperCase() : message });
})

app.get("/now", (req, res, next) => {
    req.time = new Date().toString();
    next();
}, (req, res) => {
    res.json({ "time": req.time });
});

// route parameters, will be in req.params /freecodecamp/echo returns { "echo": "freecodecamp" }
app.get("/:word/echo", (req, res) => {
    res.json({ "echo": req.params["word"] });
});

// query string parameters, in req.query, /name?first=Rian&last=Battle returns { "name": "Rian Battle" }
app.get("/name", (req, res) => {
    res.json({ "name": `${req.query["first"]} ${req.query["last"]}` });
});

app.route("/name")
    .get((req, res) => {
        res.json({ "name": `${req.query["first"]} ${req.query["last"]}` });
    })
    .post((req, res) => {
        res.json({ "name": `${req.body["first"]} ${req.body["last"]}` });
    });

module.exports = app;
