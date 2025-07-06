# User Registration System

## Overview

The Site Wave admin system now includes an **invitation-only user registration system** built with Better Auth. This system ensures that only pre-approved users can create accounts and access the admin area.

## How It Works

### 1. Admin Invitation Process

Admins must first add users to the database before they can register. Users cannot self-register.

#### Adding Users via Script

Use the provided script to add new users:

```bash
# Add a new user with default role (user)
npx tsx scripts/add-user.ts --email john@example.com --name "John Doe"

# Add a new user with specific role
npx tsx scripts/add-user.ts --email editor@example.com --name "Jane Smith" --role editor

# Add an admin user
npx tsx scripts/add-user.ts --email admin@example.com --name "Admin User" --role admin
```

**Available Roles:**

- `user` - Basic user with no admin access
- `viewer` - Can view analytics only
- `editor` - Can manage content (blog posts, services)
- `admin` - Full system access

### 2. User Registration Process

Once a user is added to the database, they can complete their registration:

1. **Visit Registration Page**: `https://your-domain.com/auth/register`
2. **Email Verification**: Enter their email and click verify
3. **Set Password**: Complete their profile and set a password
4. **Sign In**: Use their credentials to access the admin area

## API Endpoints

### Registration API

- **Endpoint**: `/api/auth/register`
- **Methods**: `GET`, `POST`

#### GET - Email Verification

Check if an email exists in the database:

```bash
curl "https://your-domain.com/api/auth/register?email=user@example.com"
```

**Response:**

```json
{
  "success": true,
  "exists": true,
  "alreadyRegistered": false,
  "userName": "John Doe",
  "message": "Email found. You can proceed with registration."
}
```

#### POST - Complete Registration

Set password for existing user:

```bash
curl -X POST "https://your-domain.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "secure-password",
    "name": "John Doe"
  }'
```

**Response:**

```json
{
  "success": true,
  "message": "Registration successful! You can now sign in with your credentials."
}
```

## Database Schema

The registration system uses the existing Better Auth tables:

- **users**: Stores user information including email, name, role
- **accounts**: Stores authentication credentials
- **sessions**: Manages user sessions

## Security Features

### Email Verification

- Users must exist in the database before registration
- Prevents unauthorized self-registration
- Validates email format and existence

### Password Requirements

- Minimum 8 characters
- Password confirmation required
- Secure password hashing via Better Auth

### Role-Based Access

- Users are assigned specific roles during invitation
- Roles control access to different admin features
- Default role is `user` if not specified

## Error Handling

The system provides clear error messages for various scenarios:

- **Email not found**: "This email is not registered for an account. Please contact an administrator to get invited."
- **Already registered**: "This user has already set up their password. Please use the sign-in page instead."
- **Validation errors**: Specific field validation messages
- **Password mismatch**: "Passwords do not match."

## User Interface

### Registration Page Features

- **Two-step process**: Email verification → Password setup
- **Real-time validation**: Instant feedback on form inputs
- **Loading states**: Visual feedback during API calls
- **Success handling**: Automatic redirect to sign-in page
- **Error handling**: Clear error messages with suggested actions

### Admin Dashboard Integration

- **Registration URL**: Copy-to-clipboard functionality
- **System status**: Clear indication of registration system availability
- **User guidance**: Step-by-step instructions for new user onboarding

## Development Tools

### Adding Users Script

The `scripts/add-user.ts` script provides:

- Command-line interface for adding users
- Email format validation
- Role validation
- Duplicate detection
- Success confirmation with next steps

### Usage Examples

```bash
# Add a basic user
npx tsx scripts/add-user.ts --email john@company.com --name "John Smith"

# Add an editor
npx tsx scripts/add-user.ts --email editor@company.com --name "Jane Editor" --role editor

# Add an admin
npx tsx scripts/add-user.ts --email admin@company.com --name "Admin User" --role admin
```

## Testing

### Manual Testing Checklist

1. **Add User**: Use script to add a test user
2. **Email Verification**: Verify email check works correctly
3. **Registration**: Complete registration process
4. **Sign In**: Verify user can sign in with new credentials
5. **Admin Access**: Confirm role-based access works

### Edge Cases to Test

- [ ] Non-existent email registration attempt
- [ ] Already registered user registration attempt
- [ ] Password mismatch handling
- [ ] Invalid email format handling
- [ ] Network error handling

## Configuration

### Environment Variables

Required environment variables:

```env
BETTER_AUTH_SECRET="your-secret-key"
BETTER_AUTH_URL="https://your-domain.com"
DATABASE_URL="your-database-connection-string"
```

### Better Auth Configuration

The system uses Better Auth with:

- Email/password authentication
- Session management
- Email verification (optional)
- Drizzle ORM adapter

## Future Enhancements

Potential improvements for future releases:

1. **Email Invitations**: Send automated invitation emails
2. **Bulk User Import**: CSV/Excel file import for multiple users
3. **User Management UI**: Admin interface for user management
4. **Role Management**: Dynamic role creation and assignment
5. **Audit Logging**: Track user registration and login activity

## Troubleshooting

### Common Issues

1. **User already exists**: Check database for existing user record
2. **Email not found**: Verify user was added to database correctly
3. **Registration fails**: Check Better Auth configuration and database connection
4. **Session issues**: Verify Better Auth secret and URL configuration

### Debugging

Enable Better Auth logging in development:

```typescript
// lib/auth/auth.ts
export const auth = betterAuth({
  // ... other config
  logger: {
    level: "debug",
    disabled: false,
  },
});
```

## Support

For issues or questions:

1. Check the Better Auth documentation: https://better-auth.com/docs
2. Review the implementation in `/app/api/auth/register/route.ts`
3. Check the registration UI in `/app/auth/register/page.tsx`
4. Verify database schema in `/lib/db/schema/`

---

**Last Updated**: December 2024
**Version**: 1.0.0
**Status**: Production Ready ✅
