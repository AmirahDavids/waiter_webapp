const express = require("express");
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://amirah:coder123@localhost:5432/waiterdb';
const pool = new Pool({
    connectionString
});


const Router = require("./waiter-routes");
const router = Router(pool);

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




app.get('/', router.index);

app.get('/waiters', router.redirectWaiter);

app.get('/waiters/:username', router.waiterPage);

app.post('/waiters/:username', router.submitShift);

app.get('/days', router.days);

app.post('/days', router.clear);








let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});