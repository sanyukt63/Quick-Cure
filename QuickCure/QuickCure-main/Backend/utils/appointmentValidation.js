function validateAppointmentRequest({ doctorId, date, time } = {}) {
  if (![doctorId, date, time].every(value => typeof value === 'string' && value.trim())) {
    return 'doctorId, date, and time are required.';
  }
  if (Number.isNaN(Date.parse(date))) {
    return 'date must be a valid date string.';
  }
  return null;
}

module.exports = { validateAppointmentRequest };
