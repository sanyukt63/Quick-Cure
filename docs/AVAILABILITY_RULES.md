# Provider Availability Rules

Appointment availability should be derived from provider schedules rather than treated as static UI data.

## Rules

- Prevent overlapping confirmed appointments.
- Validate availability again before final confirmation.
- Respect provider working hours.
- Handle cancelled and expired holds explicitly.
- Keep the displayed timezone consistent with the booking context.
