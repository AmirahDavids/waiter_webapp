const express = require("express");
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');

const pg = require("pg");
const Pool = pg.Pool;


console.log("Setting up application");

const connectionString = process.env.DATABASE_URL || 'postgresql://amirah:coder123@localhost:5432/waiterdb';
const pool = new Pool({
    connectionString
});
const Factory = require("./waiter");

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
    res.render('index', {});
});

app.get('/waiters/:username', async function (req, res) {

    var waiterName = req.params.username;

    await factory.addWaiter(waiterName);

    var idOfWaiter = await factory.getWaiterId(waiterName);



    var days = await factory.getDays();
    var selectedShift = await factory.selectAllShiftsForWaiter(idOfWaiter)

    days.forEach(day => {
        selectedShift.forEach(element => {
            if (element.dayid == day.id) {
                day.state = 'checked'
            }
        })
    })

    console.log({
        days
    });

    res.render('waiter', {
        days,
        waiterName
    });

});

app.post('/waiters/:username', async function (req, res) {

    var waiterName = req.params.username;
    var selectedDays = req.body.days

    await factory.deleteShifts(await factory.getWaiterId(waiterName))

    await factory.bookShift(waiterName, selectedDays)

    res.render('waiter', {
        days: await factory.getDays()
    });
});

app.get('/days', async function (req, res) {
    var shiftInformation = await factory.shiftInformation()
    res.render('days', {
        shiftInformation: shiftInformation
    });
});
app.post('/days', async function (req, res) {
    await factory.resetShifts()
    var shiftInformation = await factory.shiftInformation()
    res.render('days', {
        shiftInformation: shiftInformation
    });
});



let PORT = process.env.PORT || 3008;

app.listen(PORT, function () {
    console.log('App starting on port', PORT);
});