const ALLOWED_TRANSITIONS = {
  booked: new Set(['completed', 'canceled']),
  completed: new Set(),
  canceled: new Set()
};

function canTransitionAppointmentStatus(currentStatus, nextStatus) {
  return Boolean(ALLOWED_TRANSITIONS[currentStatus]?.has(nextStatus));
}

module.exports = { canTransitionAppointmentStatus };
