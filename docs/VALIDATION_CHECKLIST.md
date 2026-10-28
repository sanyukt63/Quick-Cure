# Booking Validation Checklist

Appointment booking should validate the complete request before confirmation.

- Provider or service exists.
- Selected slot is valid.
- Required patient information is present.
- The slot has not become unavailable during confirmation.
- Confirmation details match the selected appointment.

Errors should explain what the user needs to change and should not silently discard entered information.

## Appointment-slot edge cases

Include these checks when changing slot creation or booking:
- Reject a missing or whitespace-only slot label.
- Reject duplicate slots for the same doctor and time window.
- Reject invalid day counts, including negative and fractional values when integers are required.
- Re-check availability at booking time to reduce double-booking races.
- Ensure a failed booking leaves no misleading confirmation or partial appointment record.

Keep validation consistent between the user interface and the server.
