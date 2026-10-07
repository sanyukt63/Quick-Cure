# Appointment Booking Rules

The booking flow should make appointment state explicit.

## Suggested states

available -> held -> confirmed -> completed

Alternative terminal states can include cancelled or expired.

## Important rules

- Prevent booking an already confirmed slot.
- Validate provider availability before confirmation.
- Make the final confirmation action explicit.
- Preserve a clear cancellation path.
- Show date, time, provider, and status together in the confirmation view.

Booking logic should be treated as a consistency-sensitive workflow.
