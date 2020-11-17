const Factory = require("./waiter");




module.exports = function Router(pool) {

    const factory = Factory(pool);

    function index(req, res) {
        res.render('index', {});
    }

    function redirectWaiter(req, res) {
        var name = req.query.waiter;
        var route = "/waiters/" + name;
        res.redirect(route);
    }

    async function waiterPage(req, res) {

        var waiterName = req.params.username;


        await factory.addWaiter(waiterName);


        var idOfWaiter = await factory.getWaiterId(waiterName);
        var selectedShift = await factory.selectAllShiftsForWaiter(idOfWaiter)



        var days = await factory.getDays();

        days.forEach(day => {
            selectedShift.forEach(element => {
                if (element.dayid == day.id) {
                    day.state = 'checked'
                }
            })
        })

        res.render('waiter', {
            days,
            waiterName
        });

    }
    
    async function submitShift(req, res) {

        var waiterName = req.params.username;
        var selectedDays = req.body.days

        await factory.deleteShifts(await factory.getWaiterId(waiterName))

        await factory.bookShift(waiterName, selectedDays)

        var idOfWaiter = await factory.getWaiterId(waiterName);
        var selectedShift = await factory.selectAllShiftsForWaiter(idOfWaiter)


        var days = await factory.getDays();

        days.forEach(day => {
            selectedShift.forEach(element => {
                if (element.dayid == day.id) {
                    day.state = 'checked'
                }
            })
        })



        res.render('waiter', {
            days,
            waiterName,
            msg: "shift has been added sucessfully",
            color: "text-success"
        });
    }
   
    async function days(req, res) {
        var shiftInformation = await factory.shiftInformation()

        console.log(shiftInformation);
        res.render('days', {
            shiftInformation: shiftInformation
        });
    }
    
    async function clear(req, res) {
        await factory.resetShifts()
        var shiftInformation = await factory.shiftInformation()
        res.render('days', {
            shiftInformation: shiftInformation
    
    
    
        });
    }

    return {
        index,
        redirectWaiter,
        waiterPage,
        submitShift,
        days,
        clear
    }


}