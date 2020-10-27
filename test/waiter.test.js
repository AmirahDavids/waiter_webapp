const assert = require("assert");
const Factory = require('../waiter')
const pg = require("pg");


const connectionString = process.env.DATABASE_URL || 'postgresql://amirah:coder123@localhost:5432/waiterdb';


const Pool = pg.Pool;

const pool = new Pool({
    connectionString
});

const factory = Factory(pool);


describe("The factory function", function () {

    beforeEach(async function () {
        await pool.query("delete from shifts");
        await pool.query("delete from waiter");
    });

    describe("the getDays function", function () {
        it("returns days of the week", async function () {
            var days = await factory.getDays();
            var expected = [{
                    id: 1,
                    dayname: 'Sunday'
                },
                {
                    id: 2,
                    dayname: 'Monday'
                },
                {
                    id: 3,
                    dayname: 'Tuesday'
                },
                {
                    id: 4,
                    dayname: 'Wednesday'
                },
                {
                    id: 5,
                    dayname: 'Thursday'
                },
                {
                    id: 6,
                    dayname: 'Friday'
                },
                {
                    id: 7,
                    dayname: 'Saturday'
                }
            ]


            assert.deepStrictEqual(expected, days);
        });
    })

    describe("the addWaiter function", function () {
        it("adds waiter to database", async function () {

            await factory.addWaiter('Bob');

            var expected = 1;
            var actual = await factory.getNumberOfWaiters();
            assert.strictEqual(actual, expected);
        });

        it("adds waiters to database", async function () {

            await factory.addWaiter('Bob');
            await factory.addWaiter('Alice');
            await factory.addWaiter('James');
            await factory.addWaiter('Baloyi');

            var expected = 4;
            var actual = await factory.getNumberOfWaiters();
            assert.strictEqual(expected, actual);
        });
    })

    describe("the getNumberOfWaiters function", function () {
        it("gets number of waiters from database", async function () {
            await factory.addWaiter('Bob');
            await factory.addWaiter('Alice');
            await factory.addWaiter('James');
            await factory.addWaiter('Baloyi');

            var actual = await factory.getNumberOfWaiters();
            var expected = 4

            assert.strictEqual(expected, actual);
        });
    })

    describe("the bookShift function", async function () {
        it("return true if waiter exists and books selected days for a waiter", async function () {
            await factory.addWaiter("Daiyaan");
            var actual = await factory.bookShift("Daiyaan", ["1", "2", "3"])
            var expected = true;
            assert.strictEqual(actual, expected);
        });
        it(" returns false and does not book selected days", async function () {
            var actual = await factory.bookShift("Daiyaan", ["1", "2", "3"])
            var expected = false;
            assert.strictEqual(actual, expected);
        });
    })

    describe("the insertShift function", function () {
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 1)
            assert.strictEqual(actual, true)
        });
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 2)
            assert.strictEqual(actual, true)
        });
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 3)
            assert.strictEqual(actual, true)
        });
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 4)
            assert.strictEqual(actual, true)
        });
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 5)
            assert.strictEqual(actual, true)
        });
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 6)
            assert.strictEqual(actual, true)
        });
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 7)
            assert.strictEqual(actual, true)
        });
        it("it adds waiter shift to database given a waiter id and the days selected", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")
            var actual = await factory.insertShift(id, 8)
            assert.strictEqual(actual, false)
        });
    })

    describe("the selectAllShifts function", function () {
        it("it should return all the shift that were booked", async function () {

            await factory.addWaiter("Suzy");
            var id = await factory.getWaiterId("Suzy")

            await factory.insertShift(id, 1)
            await factory.insertShift(id, 2)
            await factory.insertShift(id, 3)


            var actual = await factory.selectAllShifts();

            var expected = [{
                    waiterid: id,
                    dayid: 1
                },
                {
                    waiterid: id,
                    dayid: 2
                },
                {
                    waiterid: id,
                    dayid: 3
                }
            ]

            assert.deepStrictEqual(actual, expected)


        });
        it("it should return all the shift that were booked", async function () {

            await factory.addWaiter("Daiyaan");
            var id = await factory.getWaiterId("Daiyaan")

            await factory.insertShift(id, 3)
            await factory.insertShift(id, 4)
            await factory.insertShift(id, 5)

            await factory.addWaiter("Peppa");
            var idOne = await factory.getWaiterId("Peppa")

            await factory.insertShift(idOne, 2)
            await factory.insertShift(idOne, 1)
            await factory.insertShift(idOne, 7)



            var actual = await factory.selectAllShifts();

            var expected = [{
                    waiterid: id,
                    dayid: 3
                },
                {
                    waiterid: id,
                    dayid: 4
                },
                {
                    waiterid: id,
                    dayid: 5
                }, {
                    waiterid: idOne,
                    dayid: 2
                },
                {
                    waiterid: idOne,
                    dayid: 1
                },
                {
                    waiterid: idOne,
                    dayid: 7
                }


            ]

            assert.deepStrictEqual(actual, expected)


        });
    })

    describe("the selectAllShiftsForWaiter function", function () {
        it("it should return the shift that a waiter booked", async function () {

            await factory.addWaiter("Daiyaan");
            var id = await factory.getWaiterId("Daiyaan")

            await factory.insertShift(id, 3)
            await factory.insertShift(id, 4)
            await factory.insertShift(id, 5)

            await factory.addWaiter("Peppa");
            var idOne = await factory.getWaiterId("Peppa")

            await factory.insertShift(idOne, 2)
            await factory.insertShift(idOne, 1)
            await factory.insertShift(idOne, 7)



            var actualOne = await factory.selectAllShiftsForWaiter(id);

            var actualTwo = await factory.selectAllShiftsForWaiter(idOne);

            var expectedOne = [{
                    waiterid: id,
                    dayid: 3
                },
                {
                    waiterid: id,
                    dayid: 4
                },
                {
                    waiterid: id,
                    dayid: 5
                }
            ]
            var expectedTwo = [{
                    waiterid: idOne,
                    dayid: 2
                },
                {
                    waiterid: idOne,
                    dayid: 1
                },
                {
                    waiterid: idOne,
                    dayid: 7
                }
            ]

            assert.deepStrictEqual(actualOne, expectedOne)

            assert.deepStrictEqual(actualTwo, expectedTwo)




        });
    })

    describe("the shiftInformation function", function () {
        it("it should return all the shift with information about day and waiters as well as booked status", async function () {

            await factory.addWaiter("Daiyaan");
            var id = await factory.getWaiterId("Daiyaan")

            await factory.insertShift(id, 3)
            await factory.insertShift(id, 4)
            await factory.insertShift(id, 5)

            await factory.addWaiter("Peppa");
            var idOne = await factory.getWaiterId("Peppa")

            await factory.insertShift(idOne, 2)
            await factory.insertShift(idOne, 1)
            await factory.insertShift(idOne, 7)
            await factory.insertShift(idOne, 3)
            await factory.insertShift(idOne, 4)
            await factory.insertShift(idOne, 5)

            await factory.addWaiter("George");
            var idThree = await factory.getWaiterId("George")
            await factory.insertShift(idThree, 3)

            var result = await factory.shiftInformation();
            console.log(result);


        });
    })

    after(function () {
        pool.end();
    })
})