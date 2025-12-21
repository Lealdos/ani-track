# API Documentation

## Overview

This API provides comprehensive user management and authentication endpoints built with Next.js 16, Prisma, PostgreSQL, better-auth v1.3, bcrypt, and Zod validation.

## Architecture

- **Functional Programming**: All services and utilities use pure functions
- **Type Safety**: Full TypeScript with Zod validation
- **Authentication**: Better-auth v1.3 for session management
- **Security**: Bcrypt password hashing with 12 salt rounds
- **Error Handling**: Standardized error responses with proper HTTP status codes

## Base URL

```
http://localhost:3000/api
```

## Response Format

All API responses follow this standard format:

### Success Response

```json
{
    "success": true,
    "data": {
        /* response data */
    },
    "meta": {
        "timestamp": "2025-12-21T00:00:00.000Z"
    }
}
```

### Error Response

```json
{
    "success": false,
    "error": {
        "message": "Error description",
        "code": "ERROR_CODE",
        "details": {
            /* optional error details */
        }
    },
    "meta": {
        "timestamp": "2025-12-21T00:00:00.000Z"
    }
}
```

## Authentication

### Better-Auth Endpoints

Better-auth provides built-in authentication endpoints at `/api/auth/[...all]`:

- **Sign Up**: `POST /api/auth/sign-up`
- **Sign In**: `POST /api/auth/sign-in`
- **Sign Out**: `POST /api/auth/sign-out`
- **Google OAuth**: `GET /api/auth/google`
- **GitHub OAuth**: `GET /api/auth/github`

### Custom Authentication Endpoints

#### Register User

```
POST /api/auth/register
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "SecurePass123",
    "fullName": "John Doe",
    "nickname": "johnd" // optional
}
```

**Password Requirements:**

- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

**Response:** `201 Created`

```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe",
        "nickname": "johnd",
        "favorites": null,
        "createdAt": "2025-12-21T00:00:00.000Z",
        "updatedAt": "2025-12-21T00:00:00.000Z"
    },
    "meta": {
        "timestamp": "2025-12-21T00:00:00.000Z",
        "message": "User registered successfully"
    }
}
```

#### Get Session

```
GET /api/auth/session
```

**Headers:**

- Cookie: `better-auth.session_token`

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "user": {
            "id": "uuid",
            "email": "user@example.com",
            "name": "John Doe"
        },
        "session": {
            "expiresAt": "2025-12-28T00:00:00.000Z"
        }
    }
}
```

#### Verify Credentials

```
POST /api/auth/verify
```

**Request Body:**

```json
{
    "email": "user@example.com",
    "password": "SecurePass123"
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "user": {
            "id": "uuid",
            "email": "user@example.com",
            "fullName": "John Doe",
            "nickname": "johnd",
            "favorites": null,
            "createdAt": "2025-12-21T00:00:00.000Z",
            "updatedAt": "2025-12-21T00:00:00.000Z"
        },
        "verified": true
    }
}
```

## User Management

All user endpoints require authentication via better-auth session cookie.

### Get Current User

```
GET /api/users/me
```

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe",
        "nickname": "johnd",
        "favorites": {},
        "createdAt": "2025-12-21T00:00:00.000Z",
        "updatedAt": "2025-12-21T00:00:00.000Z"
    }
}
```

### Update Current User

```
PATCH /api/users/me
```

**Request Body:** (all fields optional)

```json
{
    "email": "newemail@example.com",
    "password": "NewSecurePass123",
    "fullName": "Jane Doe",
    "nickname": "janed"
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "email": "newemail@example.com",
        "fullName": "Jane Doe",
        "nickname": "janed",
        "favorites": {},
        "createdAt": "2025-12-21T00:00:00.000Z",
        "updatedAt": "2025-12-21T01:00:00.000Z"
    },
    "meta": {
        "timestamp": "2025-12-21T01:00:00.000Z",
        "message": "Profile updated successfully"
    }
}
```

### Delete Current User

```
DELETE /api/users/me
```

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "message": "Account deleted successfully"
    }
}
```

### Change Password

```
POST /api/users/me/change-password
```

**Request Body:**

```json
{
    "currentPassword": "OldPass123",
    "newPassword": "NewSecurePass123"
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "message": "Password changed successfully"
    }
}
```

### Get User Favorites

```
GET /api/users/me/favorites
```

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "favorites": {
            "anime": ["1", "2", "3"],
            "characters": ["101", "102"]
        }
    }
}
```

### Update User Favorites

```
PATCH /api/users/me/favorites
```

**Request Body:**

```json
{
    "favorites": {
        "anime": ["1", "2", "3", "4"],
        "characters": ["101", "102", "103"]
    }
}
```

**Response:** `200 OK`

```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "email": "user@example.com",
        "fullName": "John Doe",
        "nickname": "johnd",
        "favorites": {
            "anime": ["1", "2", "3", "4"],
            "characters": ["101", "102", "103"]
        },
        "createdAt": "2025-12-21T00:00:00.000Z",
        "updatedAt": "2025-12-21T01:00:00.000Z"
    },
    "meta": {
        "timestamp": "2025-12-21T01:00:00.000Z",
        "message": "Favorites updated successfully"
    }
}
```

### List Users

```
GET /api/users?page=1&limit=10
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10, max: 100)

**Response:** `200 OK`

```json
{
    "success": true,
    "data": [
        {
            "id": "uuid-1",
            "email": "user1@example.com",
            "fullName": "User One",
            "nickname": "user1",
            "createdAt": "2025-12-21T00:00:00.000Z",
            "updatedAt": "2025-12-21T00:00:00.000Z"
        }
    ],
    "meta": {
        "timestamp": "2025-12-21T00:00:00.000Z",
        "pagination": {
            "page": 1,
            "limit": 10,
            "total": 45,
            "totalPages": 5
        }
    }
}
```

### Get User by ID

```
GET /api/users/:id
```

**Response:** `200 OK` (Public profile only)

```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "fullName": "John Doe",
        "nickname": "johnd",
        "createdAt": "2025-12-21T00:00:00.000Z"
    }
}
```

### Update User by ID

```
PATCH /api/users/:id
```

**Note:** Only the owner can update their own profile

**Request Body:** (same as PATCH /api/users/me)

### Delete User by ID

```
DELETE /api/users/:id
```

**Note:** Only the owner can delete their own account

## Error Codes

| Code                  | Status | Description                   |
| --------------------- | ------ | ----------------------------- |
| `VALIDATION_ERROR`    | 400    | Request validation failed     |
| `INVALID_DATA`        | 400    | Invalid data format           |
| `INVALID_PASSWORD`    | 400    | Incorrect password            |
| `FOREIGN_KEY_ERROR`   | 400    | Foreign key constraint failed |
| `UNAUTHORIZED`        | 401    | Authentication required       |
| `NO_SESSION`          | 401    | No active session             |
| `INVALID_CREDENTIALS` | 401    | Invalid email or password     |
| `FORBIDDEN`           | 403    | Access denied                 |
| `NOT_FOUND`           | 404    | Resource not found            |
| `EMAIL_EXISTS`        | 409    | Email already in use          |
| `USER_EXISTS`         | 409    | User already exists           |
| `DUPLICATE_RECORD`    | 409    | Duplicate record              |
| `RATE_LIMIT_EXCEEDED` | 429    | Too many requests             |
| `INTERNAL_ERROR`      | 500    | Internal server error         |
| `DATABASE_ERROR`      | 500    | Database operation failed     |

## Security Best Practices

1. **Password Security**
    - Bcrypt hashing with 12 salt rounds
    - Strong password requirements enforced by Zod

2. **Session Management**
    - Better-auth handles secure session cookies
    - HTTP-only cookies prevent XSS attacks

3. **Input Validation**
    - All inputs validated with Zod schemas
    - Detailed error messages for debugging

4. **Authorization**
    - Users can only modify their own resources
    - Proper ownership checks on all mutations

5. **Error Handling**
    - Sensitive information not exposed in errors
    - Detailed logging for debugging

## Examples

### Client-side Usage (React)

```typescript
import { signIn, signUp, signOut, useSession } from '@/lib/Auth/auth-clients'

// Register
const handleRegister = async () => {
  await signUp.email({
    email: 'user@example.com',
    password: 'SecurePass123',
    name: 'John Doe'
  })
}

// Login
const handleLogin = async () => {
  await signIn.email({
    email: 'user@example.com',
    password: 'SecurePass123'
  })
}

// Get session
function ProfileComponent() {
  const { data: session } = useSession()

  if (!session) return <div>Not logged in</div>

  return <div>Welcome {session.user.name}</div>
}

// Logout
const handleLogout = async () => {
  await signOut()
}
```

### API Usage (fetch)

```typescript
// Update user profile
const updateProfile = async () => {
    const response = await fetch('/api/users/me', {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            fullName: 'Jane Doe',
            nickname: 'janed',
        }),
        credentials: 'include', // Important for cookies
    })

    const data = await response.json()
    return data
}

// Change password
const changePassword = async () => {
    const response = await fetch('/api/users/me/change-password', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            currentPassword: 'OldPass123',
            newPassword: 'NewSecurePass123',
        }),
        credentials: 'include',
    })

    const data = await response.json()
    return data
}
```

## Testing

### Manual Testing with curl

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "fullName": "Test User"
  }'

# Get session
curl -X GET http://localhost:3000/api/auth/session \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN"

# Update profile
curl -X PATCH http://localhost:3000/api/users/me \
  -H "Content-Type: application/json" \
  -H "Cookie: better-auth.session_token=YOUR_TOKEN" \
  -d '{
    "fullName": "Updated Name"
  }'
```
