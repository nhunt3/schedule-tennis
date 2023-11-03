const allTimes = [
    '9-9:30am',
    '9:30-10am',
    '10-10:30am',
    '10:30-11am',
    '11-11:30am',
    '11:30-12pm',
    '12-12:30pm',
    '12:30-1pm',
    '1-1:30pm',
    '1:30-2pm',
    '2-2:30pm',
    '2:30-3pm',
    '3-3:30pm',
    '3:30-4pm',
    '4-4:30pm',
    '4:30-5pm',
    '5-5:30pm',
    '5:30-6pm',
    '6-6:30pm',
    '6:30-7pm',
    '7-7:30pm',
    '7:30-8pm',
    '8-8:30pm',
    '8:30-9pm',
    '9-9:30pm',
    '9:30-10pm'
];

exports.setTimeRange = (startTime, numberOf30MinSlots) => {
    const startingSlotIndex = allTimes.findIndex(item => {
        return startTime === item.split('-')[0];
    });

    let arrayOfTimeSlots = [];
    for (let i = startingSlotIndex; i < startingSlotIndex + numberOf30MinSlots; i++) {
        arrayOfTimeSlots.push(allTimes[i]);
    }

    return arrayOfTimeSlots;
};

exports.getFacilityNameOnButton = (facility) => {
    switch (facility) {
        case 'Piedmont Park': {
            return 'Sharon E. Lester at Piedmont Park';
        }
        case 'Bitsy Grant': {
            return 'Bitsy Grant';
        }
        case 'Sandy Springs': {
            return 'Sandy Springs Tennis Center';
        }
    }
};

exports.getBookNowHeader = (facility) => {
    switch (facility) {
        case 'Piedmont Park': {
            return 'sharonlestertenniscenter';
        }
        case 'Bitsy Grant': {
            return 'bitsygrant';
        }
        case 'Sandy Springs': {
            return 'sandyspringstc';
        }
    }
};
