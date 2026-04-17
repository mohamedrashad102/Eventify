# Eventify API

Eventify is a Node.js REST API for event management and ticket booking. It supports user authentication, role-based access control, event CRUD, booking management, rate limiting, structured logging, and interactive API documentation.

## Features

- User registration and login with JWT authentication
- Role-based authorization for admin and user actions
- Event management with create, read, update, and delete operations
- Booking workflow for reserving, viewing, and cancelling bookings
- Admin booking oversight and booking status management
- Pagination, filtering, search, and sorting on list endpoints
- Centralized validation, error handling, and request logging
- Swagger/OpenAPI documentation and Bruno collections for API testing

## Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- express-validator for input validation
- express-rate-limit for abuse protection
- Swagger UI for API documentation
- Jest for testing
- Supertest for HTTP endpoint testing

## Project Structure

```text
docs/
  swagger/               OpenAPI fragments
  eventify-api/          Bruno API collection
  guidelines/            Project and API guidelines
src/
  app.js                 Express app setup
  server.js              Server entry point
  config/                Database and app configuration
  controllers/           Request handlers
  middlewares/           Auth, validation, logging, error handling
  models/                Mongoose schemas
  routes/                API route definitions
  utils/                 Validation and JWT helpers
tests/
  setup.js               Shared test environment setup
  integration/
    auth.test.js         Auth route tests
    event.test.js        Event route tests
    booking.test.js      Booking/Admin route tests
.env                     Environment variables
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- MongoDB running locally or a MongoDB Atlas connection string
- npm

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and define the required variables for your environment. A typical local setup looks like this:

```env
PORT=3000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/eventify
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
```

If your implementation uses additional values for seeded accounts or deployment, add them here as needed.

### Run the Project

```bash
npm run dev
```

For production:

```bash
npm start
```

## API Documentation

When the server is running:

- API root: `http://localhost:3000`
- Swagger UI: `http://localhost:3000/api-docs`

The OpenAPI fragments live in `docs/swagger`, and the Bruno collection is available in `docs/eventify-api` for local API testing.

## Main Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate an existing user

### Events

- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a single event
- `POST /api/events` - Create an event (admin only)
- `PUT /api/events/:id` - Update an event (admin only)
- `DELETE /api/events/:id` - Delete an event (admin only)

### Bookings

- `GET /api/bookings` - Get the authenticated user's bookings
- `GET /api/bookings/:id` - Get a single booking
- `POST /api/bookings` - Create a booking
- `PATCH /api/bookings/:id` - Update booking status (admin only)
- `DELETE /api/bookings/:id` - Cancel a booking

### Admin

- `GET /api/admin/bookings` - Get all bookings (admin only)

## Bruno Collection

The project includes a Bruno collection under `docs/eventify-api` with organized folders for:

- Authentication
- Events
- Bookings
- Admin

Use the collection to run and test requests locally against the API.

## Testing

The project uses Jest and Supertest for automated API tests.

### Run Tests

```bash
npm test
```

### Current Test Coverage

- Auth routes:
  - Register success and validation failure
  - Login success and invalid credentials
- Event routes:
  - Public get all events
  - Public get single event
  - Admin create, update, and delete event
- Booking/Admin routes:
  - User get bookings, get single booking, create booking, cancel booking
  - Admin update booking status
  - Admin get all bookings

### Notes

- Tests are designed to run fast and deterministically by mocking model/auth dependencies.
- The test suite runs in-band to avoid ESM/Jest concurrency issues in this setup.

## Development Notes

- The server loads configuration from `.env` at the project root
- Swagger docs are mounted at `/api-docs`
- All protected endpoints require a valid Bearer token
- Admin routes require a user with the `admin` role

## Scripts

```bash
npm run dev        # Start the server in development mode
npm start          # Start the server in production mode
npm run seed:admin # Seed an initial admin account
npm test           # Run Jest integration tests
```

## License

This project is part of the Eventify codebase.
