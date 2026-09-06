# Swittix Backend — Project Request API

Node.js + Express + Sequelize (MySQL) backend for the "Start a Project" form
on the Swittix Technologies website.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a MySQL database:
   ```sql
   CREATE DATABASE swittix_db;
   ```

3. Copy `.env.example` to `.env` and fill in your MySQL credentials:
   ```bash
   cp .env.example .env
   ```

4. Start the dev server (auto-restarts on file changes):
   ```bash
   npm run dev
   ```

   Or for a plain start:
   ```bash
   npm start
   ```

On first run, Sequelize will automatically create the `project_requests` and
`project_request_files` tables (via `sequelize.sync({ alter: true })` in
development). For production, replace this with proper Sequelize migrations.

## API Endpoints

### `POST /api/project-requests`
Submit a new project request. Send as `multipart/form-data`.

**Text fields:**
| Field | Required | Notes |
|---|---|---|
| `fullName` | yes | |
| `email` | yes | |
| `phone` | no | |
| `company` | no | |
| `projectType` | yes | one of the PROJECT_TYPES values |
| `platforms` | no | JSON string array, e.g. `'["Web","iOS"]'` |
| `budget` | no | |
| `timeline` | no | |
| `techPreferences` | no | JSON string array |
| `description` | yes | |
| `goals` | no | |
| `hasExistingSystem` | no | |
| `referenceLinks` | no | |

**File field:**
| Field | Notes |
|---|---|
| `files` | up to 10 files, 10MB each by default. Allowed: pdf, doc, docx, png, jpg, jpeg, zip, rar |

**Response (201):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "fullName": "Umair",
    "email": "umair@example.com",
    "...": "...",
    "files": [
      { "id": 1, "originalName": "requirements.pdf", "relativePath": "project-requests/requirements-169...pdf" }
    ]
  }
}
```

**Validation error (422):**
```json
{ "success": false, "errors": { "email": "Enter a valid email" } }
```

### `GET /api/project-requests`
List all requests, paginated. Query params: `page`, `limit`, `status`.

### `GET /api/project-requests/:id`
Fetch one request with its files.

### `PATCH /api/project-requests/:id/status`
Body: `{ "status": "reviewing" }` — one of `new`, `reviewing`, `contacted`, `closed`.

### `GET /uploads/project-requests/<filename>`
Static file access for uploaded attachments.

## Folder structure

```
swittix-backend/
├── config/
│   ├── database.js       Sequelize connection
│   └── upload.js         Multer disk storage config
├── controllers/
│   └── projectRequestController.js
├── middleware/
│   └── handleUploadErrors.js
├── models/
│   ├── ProjectRequest.js
│   ├── ProjectRequestFile.js
│   └── index.js          associations
├── routes/
│   └── projectRequestRoutes.js
├── uploads/
│   └── project-requests/ uploaded files land here
├── .env.example
├── server.js
└── package.json
```
