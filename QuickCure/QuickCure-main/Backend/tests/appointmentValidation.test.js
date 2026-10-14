const test = require('node:test');
const assert = require('node:assert/strict');
const { validateAppointmentRequest } = require('../utils/appointmentValidation');

test('accepts a complete appointment request', () => {
  assert.equal(validateAppointmentRequest({ doctorId: 'doctor-1', date: '2026-10-20', time: '10:00 AM' }), null);
});

test('rejects missing appointment fields', () => {
  assert.match(validateAppointmentRequest({ doctorId: 'doctor-1', date: '2026-10-20' }), /required/i);
});

test('rejects invalid dates', () => {
  assert.match(validateAppointmentRequest({ doctorId: 'doctor-1', date: 'not-a-date', time: '10:00 AM' }), /valid date/i);
});
