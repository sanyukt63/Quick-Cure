# Appointment Date and Time Handling

- Store appointment timestamps in a consistent server-side representation.
- Make the timezone used for display explicit.
- Validate that selected slots are in the future when required.
- Re-check availability at confirmation time.
- Test daylight-saving transitions if relevant to supported regions.
- Show the selected date and time clearly before the user confirms.

## Timezone regression checks

For date/time changes, verify that:
- The displayed slot matches the value submitted to the server.
- A slot in the past cannot be booked when the business rule forbids it.
- Date-only values are not accidentally shifted by converting them through UTC.
- Availability is rechecked immediately before confirming an appointment.
- Error messages preserve the user's selected date and time for correction.

Use explicit timezone-aware values in tests instead of relying on the machine's local timezone.
