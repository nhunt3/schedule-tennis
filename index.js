const { book } = require('./tests/schedule-tennis');

exports.handler = async (event) => {
    book({
        facility: 'Piedmont Park',
        date: '11',
        startTime: '9:30',
        numberOf30MinSlots: 3,
        // courtNumber: '7',
        // courtSurface: 'Hard',
        // guestName: 'Chris'
    });
}
