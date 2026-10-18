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

test('rejects non-ISO and impossible calendar dates', () => {
  assert.match(
    validateAppointmentRequest({ doctorId: 'doctor-1', date: '10/20/2026', time: '10:00 AM' }),
    /ISO date/i
  );
  assert.match(
    validateAppointmentRequest({ doctorId: 'doctor-1', date: '2026-02-30', time: '10:00 AM' }),
    /ISO date/i
  );
});

test('rejects whitespace-only appointment fields', () => {
  assert.match(
    validateAppointmentRequest({ doctorId: 'doctor-1', date: '2026-10-20', time: '   ' }),
    /required/i
  );
  assert.match(
    validateAppointmentRequest({ doctorId: '   ', date: '2026-10-20', time: '10:00 AM' }),
    /required/i
  );
});
