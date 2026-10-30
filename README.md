# 🩺 Quick-Cure

> A healthcare appointment platform for patients, doctors, and hospital administrators.

Quick-Cure is organized as a static web interface with a Node.js/Express backend. The main application is inside `QuickCure/QuickCure-main`.

## ✨ Application Areas

- Patient registration and sign-in
- Doctor and hospital discovery
- Appointment booking and management
- Doctor-facing pages
- Hospital/admin management pages
- Patient profile pages

The exact availability of each workflow depends on the current application implementation.

## 📁 Repository Layout

```text
Quick-Cure/
└── QuickCure/
    └── QuickCure-main/
        ├── Backend/
        │   ├── app.js
        │   ├── server.js
        │   ├── db/
        │   └── routes/
        ├── index.html
        ├── indexPatient.html
        ├── indexDoctor.html
        ├── patient.html
        └── doctor.html
```

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- MongoDB
- A browser
- A local static server such as VS Code Live Server (the configured backend CORS origins include port `5500`)

### 1. Clone the repository

```bash
git clone https://github.com/sanyukt63/Quick-Cure.git
cd Quick-Cure
```

### 2. Start the backend

```bash
cd QuickCure/QuickCure-main/Backend
npm install
```

The backend reads its MongoDB connection string from `DB_CONNECT`. Set it in your local environment before starting the server. For a local MongoDB instance, the value may look like:

```text
DB_CONNECT=mongodb://127.0.0.1:27017/quickcure
```

Start the API:

```bash
node server.js
```

The server listens on port `3040`.

### 3. Open the frontend

Open `QuickCure/QuickCure-main` in VS Code and launch `index.html` using Live Server on port `5500`, or serve that directory with another static server configured to use an allowed CORS origin.

Keep the backend running while using pages that call the API.

## 🧪 Backend Tests

The backend package defines a Node.js test script:

```bash
cd QuickCure/QuickCure-main/Backend
npm test
```

## 🔐 Configuration and Safety

- Keep MongoDB credentials in local environment variables.
- Do not commit `.env` files, database passwords, tokens, or personal patient data.
- Use synthetic records for development and testing.
- This project is a software prototype, not a substitute for professional medical advice or emergency care.

## 🗺️ Development Priorities

- Document API routes and expected request/response shapes
- Add automated tests for appointment workflows
- Improve validation and error handling
- Document database setup and sample development data
- Add screenshots and a short demo walkthrough

## 🤝 Contributing

Bug reports, documentation improvements, UI ideas, tests, and focused code contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Make a focused change
4. Test the change locally
5. Open a pull request describing the change

⭐ Star the repository if you want to follow its development.
