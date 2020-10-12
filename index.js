const express = require("express");
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://amirah:coder123@localhost:5432/';
const pool = new Pool({
    connectionString
});
const Factory = require("./");
const factory = Factory(pool);

let app = express();

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json())

// Routes...

app.get('/', function (req, res) {
    res.render('home');
});











    
let PORT = process.env.PORT || 3017;
app.listen(PORT, function () {
  console.log('App starting on port', PORT);
});

