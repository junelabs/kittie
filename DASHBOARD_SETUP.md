# Dashboard Protection Setup

## Environment Variables

Add these variables to your `.env.local` file:

```bash
# Dashboard Protection
ADMIN_EMAIL=your-email@domain.com
DASHBOARD_PASSWORD=your-secure-password-here
NEXT_PUBLIC_ADMIN_EMAIL=your-email@domain.com
```

## How It Works

### 1. Middleware Protection
- Protects all dashboard routes (`/dashboard`, `/kit`, `/settings`, `/billing`, `/help`, `/assets`)
- Checks for `ADMIN_EMAIL` environment variable
- Allows access in development mode
- Redirects unauthorized users to home page

### 2. Client-Side Authentication
- Additional password protection for extra security
- Uses `DASHBOARD_PASSWORD` environment variable
- Stores authentication status in localStorage
- Shows password prompt if not authenticated

### 3. Development Mode
- Automatically allows access when `NODE_ENV=development`
- No password required in development

## Deployment

### Vercel
1. Go to your project settings
2. Add environment variables:
   - `ADMIN_EMAIL`: Your email address
   - `DASHBOARD_PASSWORD`: A secure password
   - `NEXT_PUBLIC_ADMIN_EMAIL`: Your email address (same as above)

### Other Platforms
Add the same environment variables to your hosting platform.

## Testing

1. **Development**: Dashboard should be accessible without password
2. **Production**: 
   - Without env vars: Dashboard redirects to home
   - With env vars: Shows password prompt
   - With correct password: Access granted

## Security Notes

- The middleware provides the first layer of protection
- Client-side authentication is additional security
- Environment variables should be kept secret
- Consider using a more robust auth system for production
