# Death Note API Documentation

## Overview

This document provides detailed information about the API endpoints in the Death Note application. The API follows RESTful principles and all responses are in JSON format.

## Authentication

All API routes under the `/api` path are protected by Clerk authentication middleware. Requests must include a valid JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## API Endpoints

### Contact Management

#### `GET /api/contacts`

Retrieves the user's contacts.

**Request Parameters:** None

**Response:**

```json
{
  "contacts": [
    {
      "id": "string",
      "name": "string",
      "email": "string",
      "status": "Accepted" | "Pending"
    }
  ]
}
```

#### `POST /api/contacts`

Adds a new contact.

**Request Body:**

```json
{
  "name": "string",
  "email": "string"
}
```

**Response:**

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "status": "Pending"
}
```

#### `DELETE /api/contacts/:id`

Deletes a contact.

**URL Parameters:**
- `id`: The ID of the contact to delete

**Response:**

```json
{
  "success": true
}
```

### Note Management

#### `GET /api/notes`

Retrieves the user's note.

**Response:**

```json
{
  "content": "string",
  "updatedAt": "string"
}
```

#### `POST /api/notes`

Creates or updates the user's note.

**Request Body:**

```json
{
  "content": "string",
  "isDraft": boolean
}
```

**Response:**

```json
{
  "id": "string",
  "content": "string",
  "isDraft": boolean,
  "updatedAt": "string"
}
```

### Verification System

#### `POST /api/verification`

Records a user verification (proof-of-life).

**Request Body:** None

**Response:**

```json
{
  "success": true,
  "nextVerificationDate": "string"
}
```

#### `GET /api/verification/history`

Retrieves the user's verification history.

**Query Parameters:**
- `limit` (optional): Maximum number of records to return (default: 10)

**Response:**

```json
{
  "history": [
    {
      "id": "string",
      "date": "string",
      "device": "string",
      "location": "string",
      "status": "Success" | "Failed"
    }
  ]
}
```

### Placeholder API Routes

#### `POST /api/deepseek`

Experimental API route for generating content using AI. This is a placeholder implementation that simulates AI content generation.

**Request Body:**

```json
{
  "prompt": "string"
}
```

**Response:**

```json
{
  "content": "string"
}
```

#### `POST /api/firecrawl`

Experimental API route for extracting content from external URLs. This is a placeholder implementation.

**Request Body:**

```json
{
  "url": "string"
}
```

**Response:**

```json
{
  "content": "string"
}
```

## Error Handling

All API endpoints return appropriate HTTP status codes:

- `200 OK`: The request was successful
- `400 Bad Request`: The request was invalid
- `401 Unauthorized`: Authentication is required
- `403 Forbidden`: The user does not have permission
- `404 Not Found`: The requested resource was not found
- `500 Internal Server Error`: An unexpected error occurred

Error responses have the following format:

```json
{
  "error": "Error message"
}
```

## Rate Limiting

API endpoints are rate-limited to 100 requests per minute per user. 