# FHIR CLIENT TESTING TOOL 🔎🔥
## A proxy application which records transactions between the FHIR requester and the FHIR responder to the database

### Run backend
```bash
cp .env-template .env
make run
```

The backend will be available on the http://localhost:8080

### Run UI
```bash
cd session_ui
yarn
yarn dev
```

The UI will be available on the http://localhost:5173

### Important
Setup backendUrl in session_ui/src/config.ts