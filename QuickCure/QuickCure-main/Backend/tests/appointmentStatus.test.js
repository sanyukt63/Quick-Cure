const test = require('node:test');
const assert = require('node:assert/strict');
const { canTransitionAppointmentStatus } = require('../utils/appointmentStatus');

test('allows booked appointments to complete or cancel', () => {
  assert.equal(canTransitionAppointmentStatus('booked', 'completed'), true);
  assert.equal(canTransitionAppointmentStatus('booked', 'canceled'), true);
});

test('prevents transitions from terminal appointment states', () => {
  for (const status of ['completed', 'canceled']) {
    assert.equal(canTransitionAppointmentStatus(status, 'booked'), false);
    assert.equal(canTransitionAppointmentStatus(status, 'completed'), false);
    assert.equal(canTransitionAppointmentStatus(status, 'canceled'), false);
  }
});

test('rejects unknown states', () => {
  assert.equal(canTransitionAppointmentStatus('unknown', 'booked'), false);
});
