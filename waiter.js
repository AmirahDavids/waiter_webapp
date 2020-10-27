module.exports = function Factory(pool) {


    async function getDays() {
        var allDays = await pool.query("select * from daysoftheweek");
        return allDays.rows
    }

    async function doesWaiterExist(waiterName) {
        var result = await pool.query("select * from waiter where waiterName=$1", [waiterName]);

        if (result.rowCount > 0) {
            return true;
        } else {
            return false
        }
    }

    async function addWaiter(waiterName) {
        if (await doesWaiterExist(waiterName)) {
            return false;
        } else {
            await pool.query("insert into waiter (waiterName) values ($1)", [waiterName]);
            return true;
        }
    }

    async function getNumberOfWaiters() {
        var result = await pool.query("select * from waiter")
        return result.rowCount;
    }

    async function getWaiterId(name) {
        if (await doesWaiterExist(name)) {
            var result = await pool.query("select id from waiter where waiterName = $1", [name])
            return result.rows[0]["id"]
        }
        return 0;
    }

    async function bookShift(waiterName, selectedDays) {
        if (await doesWaiterExist(waiterName)) {
            var waiterID = await getWaiterId(waiterName);
            for (let i = 0; i < selectedDays.length; i++) {
                var dayID = parseInt(selectedDays[i]);
                await insertShift(waiterID, dayID)
            }
            return true;
        } else {
            return false;
        }
    }

    async function isValidDayId(id) {
        var result = await pool.query("select * from daysOfTheWeek where id=$1", [id]);
        if (result.rowCount > 0) {
            return true;
        } else {
            return false;
        }
    }

    async function isValidWaiterId(id) {
        var result = await pool.query("select waiterName from waiter where id=$1", [id])
        if (result.rowCount > 0) {
            return true;
        } else {
            return false;
        }
    }

    async function insertShift(waiterID, dayID) {
        if (await isValidWaiterId(waiterID)) {
            if (await isValidDayId(dayID)) {
                await pool.query("insert into shifts (waiterId, dayId) values ($1, $2)", [waiterID, dayID])
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    async function shiftInformation() {

        var data = await allShiftInformation();

        data.forEach(day => {
            if (day.waiters.length > 3) {
                day.status = "bg-danger";
            } else if (day.waiters.length == 3) {
                day.status = "bg-success";
            } else {
                day.status = "bg-warning";
            }
        });
        return data;
    }

    async function selectAllShifts() {
        var result = await pool.query("select shifts.waiterId, shifts.dayId from shifts")
        if (result.rowCount > 0) {
            return result.rows
        } else {
            return []
        }
    }

    async function selectAllShiftsForWaiter(id) {
        var result = await pool.query("select shifts.waiterId, shifts.dayId  from shifts join waiter on shifts.waiterId=waiter.id where waiterId=$1", [id])
        if (result.rowCount > 0) {
            return result.rows
        } else {
            return []
        }
    }

    async function allShifts() {
        var result = await pool.query("select daysOfTheWeek.id, waiter.waiterName, daysOfTheWeek.dayName  from shifts join waiter on shifts.waiterId=waiter.id join daysOfTheWeek on daysOfTheWeek.id=shifts.dayId")
        if (result.rowCount > 0) {
            return result.rows
        } else {
            return []
        }
    }

     function getDayFromId(id){
       return dayList[id]
    }

    var dayList = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"]

    async function shiftDays() {

        var days = await getDays();
        var shifts = await allShifts();
        var daysAndShifts = [];

        // console.log(days);
        for (var day in days) {

            var dayObject = {};

            shifts.map(shift =>  {

                var dayName =  getDayFromId(day);
                var shiftDayName =  getDayFromId(Number(shift.id)-1);


                if (dayObject[dayName] === undefined) {
                    dayObject[dayName] = []
                }

                if (dayName === shiftDayName) {
                    dayObject[dayName].push(shift.waitername)
                }
            })

            daysAndShifts.push(dayObject);
        }
        return daysAndShifts;

    }

    async function allShiftInformation() {
        var shifts = await shiftDays();
        var data = [];


        shifts.map(shift => {
            var [dayName, waiters] = Object.entries(shift)[0]

            var shiftForDay = data.find(currentShift => {
                return dayName === currentShift.weekday
            })
           

            if (shiftForDay) {
                shiftForDay.waiters = waiters;
            } else {
                data.push({
                    weekday: dayName,
                    waiters: waiters
                })
            }
        })
        return data;

    }


    return {
        addWaiter,
        insertShift,
        bookShift,
        getDays,
        getWaiterId,
        getNumberOfWaiters,
        shiftInformation,
        selectAllShifts,
        selectAllShiftsForWaiter
    }

}