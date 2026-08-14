const dayjs = require('dayjs');


/**
* Generate N days of slots, with times like ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
*/
function generateSlots(days = 7, times = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']) {
const schedule = [];
for (let i = 0; i < days; i++) {
const date = dayjs().add(i, 'day').startOf('day').toDate();
schedule.push({
date,
slots: times.map((t) => ({ time: t, booked: false }))
});
}
return schedule;
}


module.exports = { generateSlots };