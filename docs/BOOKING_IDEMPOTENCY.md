# Duplicate Booking Prevention

Booking requests may be retried after timeouts or network failures. The backend should prevent retries from creating duplicate appointments.

- Use a stable request identifier when appropriate.
- Check existing booking state before creating a new record.
- Make confirmation responses consistent for safe retries.
- Enforce relevant uniqueness constraints in the database.
- Test simultaneous requests for the same slot.
