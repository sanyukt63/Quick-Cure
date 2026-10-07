# Core Data Model

The appointment workflow can be represented around a few stable entities.

## Core entities

- Patient — person requesting an appointment
- Provider — doctor or healthcare professional
- Availability — provider time windows
- Appointment — confirmed or pending booking
- Notification — user-facing booking updates

## Relationship principle

An appointment should reference a patient, provider, and specific scheduled time. Availability should be checked before an appointment becomes confirmed.

Keep identity information separate from appointment-specific state where practical.
