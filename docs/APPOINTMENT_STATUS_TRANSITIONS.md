# Appointment Status Transitions

Document allowed appointment state changes explicitly.

- Requested appointments may become confirmed or rejected.
- Confirmed appointments may become rescheduled, cancelled, or completed.
- Cancelled appointments should not silently return to confirmed.
- Repeated requests should not create duplicate bookings.

Validate transitions on the backend so the interface cannot create invalid states by itself.
