const dayjs = require('dayjs');


/**
* Generate N days of slots, with times like ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
*/
function generateSlots(days = 7, times = ['10:00 AM', '11:00 AM', '2:00 PM', '4:00 PM']) {
if (!Number.isInteger(days) || days < 0) throw new TypeError('days must be a non-negative integer');
if (!Array.isArray(times) || times.some((time) => typeof time !== 'string' || !time.trim())) {
throw new TypeError('times must be an array of non-empty strings');
}
if (new Set(times).size !== times.length) throw new TypeError('times must not contain duplicates');
// Keep each generated slot unique within a day's schedule.

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