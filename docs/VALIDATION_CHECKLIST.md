# Booking Validation Checklist

Appointment booking should validate the complete request before confirmation.

- Provider or service exists.
- Selected slot is valid.
- Required patient information is present.
- The slot has not become unavailable during confirmation.
- Confirmation details match the selected appointment.

Errors should explain what the user needs to change and should not silently discard entered information.
