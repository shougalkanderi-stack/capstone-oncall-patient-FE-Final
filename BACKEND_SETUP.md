# Backend Connection Setup

## Quick Setup

1. **Update Backend URL**: Open `utils/config.ts` and update the `BACKEND_URL` to match your backend server:

```typescript
export const CONFIG = {
  BACKEND_URL: "http://localhost:3000/api", // Change this to your backend URL
  // ... other config
};
```

## Common Backend URLs

- **Local Development**: `http://localhost:3000/api`
- **Local with different port**: `http://localhost:5000/api` (or whatever port your backend uses)
- **Production**: `https://your-domain.com/api`

## Troubleshooting Login Issues

### 1. Check Backend URL
Make sure your backend is running and the URL in `utils/config.ts` is correct.

### 2. Check Backend Endpoints
Your backend should have these endpoints:
- `POST /auth/login` - for patient login
- `POST /auth/register` - for patient registration  
- `GET /auth/me` - to get current user profile
- `GET /appointments/me` - to get patient appointments

### 3. Check Console Logs
The app now logs all API requests and responses. Check your terminal/console for:
- API request logs
- Error messages
- Response data

### 4. Test Backend Connection
You can test if your backend is accessible by visiting the URL in your browser or using curl:
```bash
curl http://localhost:3000/api/auth/login
```

## API Response Format

The app expects these response formats:

### Login Response
```json
{
  "token": "your-jwt-token",
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

## Features Now Connected

✅ **Authentication**
- Login with Civil ID and password
- Registration with full patient details
- Automatic token management
- Logout functionality

✅ **Profile Management**
- Fetch real user profile from backend
- Display user information dynamically
- Loading and error states

✅ **Appointments**
- Fetch patient appointments from backend
- Book new appointments
- Cancel appointments
- Get available doctors and slots

✅ **Error Handling**
- Better error messages
- Loading states
- Network error handling
- Token expiration handling

## Next Steps

1. Start your backend server
2. Update the `BACKEND_URL` in `utils/config.ts`
3. Test login with valid credentials
4. Check console logs for any errors
5. Verify that appointments and profile data load correctly 