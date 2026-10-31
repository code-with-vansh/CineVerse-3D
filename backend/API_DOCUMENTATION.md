# CineVerse 3D — REST API Documentation

> **Base URL:** `http://localhost:5000/api`  
> **Database:** PostgreSQL with Prisma ORM  
> **Authentication Scheme:** Bearer JWT in `Authorization` header (`Authorization: Bearer <token>`)

---

## Table of Contents
1. [Authentication Endpoints](#1-authentication-endpoints)
2. [Movie Catalog Endpoints](#2-movie-catalog-endpoints)
3. [Theatre & Shows Endpoints](#3-theatre--shows-endpoints)
4. [3D Dynamic Seat Availability](#4-3d-dynamic-seat-availability)
5. [Temporary Seat Holds & Reservations (Concurrency Safe)](#5-temporary-seat-holds--reservations)
6. [User Profile & Booking History](#6-user-profile--booking-history)
7. [Postman Collection](#7-postman-collection)

---

## 1. Authentication Endpoints

### 1.1 Register User
- **Method:** `POST`
- **Route:** `/api/auth/register`
- **Auth:** Public
- **Request Body:**
```json
{
  "name": "Rohan Roy",
  "email": "rohan@cineverse.com",
  "password": "Password@123"
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "User registered successfully.",
  "data": {
    "user": {
      "id": "c1f7a0b3-...",
      "name": "Rohan Roy",
      "email": "rohan@cineverse.com",
      "role": "USER",
      "createdAt": "2026-10-31T16:22:01.946Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Responses:**
  - `400 Bad Request`: Duplicate email or missing required fields.

### 1.2 Login User
- **Method:** `POST`
- **Route:** `/api/auth/login`
- **Auth:** Public
- **Request Body:**
```json
{
  "email": "user@cineverse.com",
  "password": "User@123"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "user": {
      "id": "...",
      "name": "Vansh Sharma",
      "email": "user@cineverse.com",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```
- **Error Responses:**
  - `401 Unauthorized`: Invalid email or password.

### 1.3 Get Current User
- **Method:** `GET`
- **Route:** `/api/auth/me`
- **Auth:** Required (`Bearer <token>`)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "name": "Vansh Sharma",
      "email": "user@cineverse.com",
      "role": "USER",
      "createdAt": "2026-10-31T16:15:00.000Z"
    }
  }
}
```

---

## 2. Movie Catalog Endpoints

### 2.1 Get All Movies
- **Method:** `GET`
- **Route:** `/api/movies`
- **Query Parameters:**
  - `page` (optional, default: 1)
  - `limit` (optional, default: 50)
  - `language` (optional, e.g. `Tamil`, `Telugu`, `Hindi`, `Kannada`, `Malayalam`)
  - `genre` (optional, e.g. `Action`, `Sci-Fi`)
  - `search` (optional)
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "total": 26,
    "page": 1,
    "limit": 50,
    "totalPages": 1,
    "movies": [...]
  }
}
```

### 2.2 Get Movie by ID
- **Method:** `GET`
- **Route:** `/api/movies/:id`
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "movie": {
      "id": "...",
      "title": "Kalki 2898 AD",
      "language": "Telugu",
      "rating": 9.2,
      "shows": [...]
    }
  }
}
```

### 2.3 Search Movies
- **Method:** `GET`
- **Route:** `/api/movies/search?q=Kalki`
- **Success Response (200 OK):** Returns matching movies matching title, description, or cast.

### 2.4 Language Filter
- **Method:** `GET`
- **Route:** `/api/movies/language/:language`

### 2.5 Admin Movie Management
- `POST /api/movies` (Auth: Admin) — Create new movie
- `PUT /api/movies/:id` (Auth: Admin) — Update movie
- `DELETE /api/movies/:id` (Auth: Admin) — Delete movie

---

## 3. Theatre & Shows Endpoints

### 3.1 Get All Theatres
- **Method:** `GET`
- **Route:** `/api/theatres`
- **Query Parameters:** `city` (optional, e.g. `Mumbai`, `Bengaluru`, `Chennai`)

### 3.2 Get Theatres by Movie
- **Method:** `GET`
- **Route:** `/api/movies/:movieId/theatres`
- **Query Parameters:** `city` (optional), `date` (optional)

### 3.3 Get Shows with Filters
- **Method:** `GET`
- **Route:** `/api/shows`
- **Query Parameters:** `movieId`, `theatreId`, `city`, `date`, `language`, `screenType`

---

## 4. 3D Dynamic Seat Availability

### 4.1 Get Show Seats
- **Method:** `GET`
- **Route:** `/api/shows/:showId/seats`
- **Auth:** Public
- **Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "showId": "9dca943d-...",
    "showDate": "2026-11-01",
    "startTime": "10:30 AM",
    "totalSeats": 154,
    "availableSeatsCount": 118,
    "seats": [
      {
        "id": "3bbfe3f7-...",
        "showSeatId": "4c9e1...",
        "row": "A",
        "seatNumber": 1,
        "category": "SILVER",
        "price": 180,
        "status": "AVAILABLE"
      },
      {
        "id": "3bbfe3f8-...",
        "showSeatId": "4c9e2...",
        "row": "A",
        "seatNumber": 2,
        "category": "SILVER",
        "price": 180,
        "status": "BOOKED"
      }
    ]
  }
}
```

---

## 5. Temporary Seat Holds & Reservations

### 5.1 Atomically Hold Seats (Locking)
- **Method:** `POST`
- **Route:** `/api/bookings/hold`
- **Auth:** Optional / Authenticated
- **Request Body:**
```json
{
  "showId": "9dca943d-...",
  "seatIds": ["seat-guid-1", "seat-guid-2"]
}
```
- **Success Response (201 Created):**
```json
{
  "success": true,
  "message": "Seats held successfully. Please complete payment within the reservation window.",
  "data": {
    "bookingReference": "CV3D-MVWM0SKA-4C39FF",
    "bookingId": "c88e-...",
    "showId": "9dca943d-...",
    "status": "PENDING",
    "totalTicketAmount": 360,
    "seatsCount": 2,
    "lockedUntil": "2026-10-31T16:35:00.000Z",
    "expiresInSeconds": 300,
    "seats": [
      { "seatId": "...", "row": "A", "seatNumber": 1, "category": "SILVER", "price": 180 }
    ]
  }
}
```
- **Error Responses:**
  - `409 Conflict`: One or more requested seats are already booked or held by another guest.
  - `400 Bad Request`: Exceeds 8 seats or seats do not belong to screen.

### 5.2 Release Seat Hold
- **Method:** `POST`
- **Route:** `/api/bookings/release`
- **Request Body:**
```json
{
  "bookingReference": "CV3D-MVWM0SKA-4C39FF"
}
```
- **Success Response (200 OK):**
```json
{
  "success": true,
  "message": "Seat hold successfully released.",
  "bookingReference": "CV3D-MVWM0SKA-4C39FF"
}
```

---

## 6. User Profile & Booking History

### 6.1 Get User Booking History
- **Method:** `GET`
- **Route:** `/api/users/me/bookings`
- **Auth:** Required (`Bearer <token>`)
- **Success Response (200 OK):** Returns all pending and confirmed bookings with seat details and prices.

---

## 7. Postman Collection

Import `backend/CineVerse_3D_Postman_Collection.json` directly into Postman to test all endpoints.
