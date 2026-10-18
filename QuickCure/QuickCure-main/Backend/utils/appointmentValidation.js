function isValidIsoDate(date) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
  const parsed = new Date(`${date}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
}

function validateAppointmentRequest({ doctorId, date, time } = {}) {
  if (![doctorId, date, time].every(value => typeof value === 'string' && value.trim())) {
    return 'doctorId, date, and time are required.';
  }
  if (!isValidIsoDate(date)) {
    return 'date must be a valid ISO date in YYYY-MM-DD format.';
  }
  return null;
}

module.exports = { validateAppointmentRequest };
