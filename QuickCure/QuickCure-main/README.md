# QuickCure

QuickCure is a healthcare appointment platform intended to help patients find doctors and book appointments, while providing dedicated pages for doctors and hospital administrators.

## Main Areas

- Patient registration and sign-in
- Doctor discovery and doctor-facing pages
- Hospital and administrator pages
- Appointment booking and management
- Patient profile pages

## Technology

- HTML
- CSS
- JavaScript
- Node.js and Express backend
- MongoDB database

## Run the Backend

From this directory:

```bash
cd Backend
npm install
```

Set the `DB_CONNECT` environment variable to your MongoDB connection string. For local development, an example is:

```text
DB_CONNECT=mongodb://127.0.0.1:27017/quickcure
```

Start the API:

```bash
node server.js
```

The backend listens on port `3040`.

## Run the Frontend

Open this directory in VS Code and serve `index.html` with Live Server on port `5500`. The backend CORS configuration currently allows `http://localhost:5500` and `http://127.0.0.1:5500`.

## Tests

From the `Backend` directory, run:

```bash
npm test
```

## Development Notes

- Keep database credentials and tokens out of source control.
- Use synthetic data while developing.
- Add or update tests when changing appointment, authentication, or patient workflows.
- Verify the frontend and backend together after changing API behavior.

This repository is a software prototype and is not a substitute for professional medical advice.
