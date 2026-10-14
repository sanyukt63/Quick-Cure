const test = require('node:test');
const assert = require('node:assert/strict');
const { generateSlots } = require('../utils/slots');

test('generates the requested number of days and available slots', () => {
  const schedule = generateSlots(2, ['9:00 AM', '1:00 PM']);
  assert.equal(schedule.length, 2);
  assert.equal(schedule[0].slots.length, 2);
  assert.equal(schedule[0].slots[0].booked, false);
  assert.ok(schedule[0].date instanceof Date);
});

test('allows an empty schedule', () => {
  assert.deepEqual(generateSlots(0), []);
});

test('rejects invalid days and time lists', () => {
  assert.throws(() => generateSlots(-1), /non-negative integer/);
  assert.throws(() => generateSlots(2, '9:00 AM'), /array of non-empty strings/);
  assert.throws(() => generateSlots(2, ['']), /array of non-empty strings/);
});
