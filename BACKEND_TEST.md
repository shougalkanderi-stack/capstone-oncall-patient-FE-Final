# Backend Endpoint Testing Guide

## Test Your Backend Endpoints

### 1. Test Login Endpoint
```bash
curl -X POST http://localhost:5000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "civilID": "test123",
    "password": "password123"
  }'
```

### 2. Test Register Endpoint
```bash
curl -X POST http://localhost:5000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Patient",
    "email": "test@example.com",
    "phone": "123456789",
    "civilID": "test123",
    "password": "password123",
    "role": "Patient"
  }'
```

### 3. Test Profile Endpoint (requires token)
```bash
curl -X GET http://localhost:5000/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 4. Test Appointments Endpoint (requires token)
```bash
curl -X GET http://localhost:5000/appointments/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Expected Response Formats

### Login Success Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "name": "Patient Name",
    "email": "patient@email.com",
    "civilID": "123456789"
  }
}
```

### Register Success Response
```json
{
  "message": "Patient registered successfully",
  "user": {
    "name": "Patient Name",
    "email": "patient@email.com",
    "civilID": "123456789"
  }
}
```

### Profile Response
```json
{
  "name": "Patient Name",
  "email": "patient@email.com",
  "phone": "123456789",
  "civilID": "123456789",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Appointments Response
```json
[
  {
    "_id": "appointment_id",
    "doctorName": "Dr. Smith",
    "date": "2024-01-15",
    "time": "10:00 AM",
    "type": "General Checkup",
    "status": "confirmed"
  }
]
```

## Troubleshooting

### If endpoints return 404:
- Check if your backend server is running
- Verify the port number (5500)
- Check if the endpoints are exactly `/auth/login` and `/auth/register`

### If endpoints return 500:
- Check your backend server logs
- Verify the request body format matches what your backend expects

### If endpoints return CORS errors:
- Your backend needs to allow requests from your frontend
- Add CORS headers to your backend

### If login works but profile/appointments don't:
- Check if the token is being sent correctly
- Verify the `/auth/me` and `/appointments/me` endpoints exist

## Next Steps

1. Test each endpoint using curl commands above
2. Check the console logs in your React Native app
3. Update the `BACKEND_URL` in `utils/config.ts` if needed
4. Make sure your backend is running on the correct port 