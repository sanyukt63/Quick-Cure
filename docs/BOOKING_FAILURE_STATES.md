# Booking Failure States

The appointment flow should explain common failure states clearly.

- Slot no longer available
- Provider schedule changed
- Required information is missing
- Network request failed
- Booking confirmation could not be completed

When a booking fails, show a next step and avoid displaying a confirmed status unless the server confirms the booking.

## Recovery checks

For each booking failure state, confirm that:
- The message explains what happened without exposing internal errors.
- The user's selected doctor, date, and slot remain available when safe to retain.
- Retrying cannot accidentally create duplicate appointments.
- An unavailable slot prompts the user to choose another time.
- The interface does not show success until the server confirms the booking.

Cover network timeouts and stale availability in regression tests.
