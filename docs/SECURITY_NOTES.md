# Security Notes

The application should treat patient and appointment data as sensitive.

- Never commit credentials or API keys.
- Validate server-side input even when the UI validates it.
- Protect authenticated routes.
- Avoid exposing unnecessary patient information in responses.
- Use secure session or token handling.
- Keep dependencies updated.

Security-sensitive changes should be reviewed carefully before deployment.
