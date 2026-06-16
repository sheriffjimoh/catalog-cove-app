# Security Policy

## 🔒 Security Best Practices

This document outlines security considerations and best practices for the Catalog Cove application.

## Reporting Security Vulnerabilities

If you discover a security vulnerability, please email the maintainer directly rather than opening a public issue. Include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Current Security Measures

### ✅ Built-in Protections

1. **CSRF Protection**
   - All forms include CSRF tokens automatically via Laravel
   - Inertia.js handles CSRF token management

2. **SQL Injection Prevention**
   - Using Eloquent ORM for all database queries
   - Parameterized queries by default

3. **XSS Protection**
   - React automatically escapes all rendered content
   - No `dangerouslySetInnerHTML` usage in codebase

4. **Authentication & Authorization**
   - Laravel Sanctum for API authentication
   - Laravel Fortify for authentication features
   - Session-based authentication for web routes
   - Middleware-based route protection

5. **Input Validation**
   - Form validation on all user inputs
   - File upload restrictions (type, size)
   - Server-side validation for all requests

6. **Password Security**
   - Passwords hashed with bcrypt
   - Configurable rounds: `BCRYPT_ROUNDS=12` in .env

## 🚨 Security Checklist

### Before Deployment

- [ ] **Environment Configuration**
  - [ ] Set `APP_DEBUG=false` in production
  - [ ] Use strong `APP_KEY` (never share)
  - [ ] Set secure `SESSION_DOMAIN` and `SESSION_SECURE=true`
  - [ ] Configure proper `CORS` settings if needed

- [ ] **Credentials Management**
  - [ ] All API keys in `.env` file (never commit)
  - [ ] Remove any test files with hardcoded credentials
  - [ ] Rotate credentials if accidentally exposed
  - [ ] Use environment variables for all secrets

- [ ] **HTTPS/SSL**
  - [ ] Enable HTTPS in production
  - [ ] Set `APP_URL` to use `https://`
  - [ ] Configure SSL certificates properly
  - [ ] Force HTTPS redirects

- [ ] **Database Security**
  - [ ] Use strong database passwords
  - [ ] Restrict database access to application only
  - [ ] Regular database backups
  - [ ] Encrypt sensitive data at rest

- [ ] **File Permissions**
  - [ ] Set proper permissions on `storage/` and `bootstrap/cache/`
  - [ ] Ensure `.env` is not web-accessible
  - [ ] Verify `.gitignore` excludes sensitive files

- [ ] **Dependency Security**
  - [ ] Run `composer audit` regularly
  - [ ] Run `npm audit` regularly
  - [ ] Keep all dependencies up to date
  - [ ] Review security advisories

- [ ] **Error Handling**
  - [ ] Disable detailed error messages in production
  - [ ] Log errors to files, not browser
  - [ ] Set up error monitoring (Sentry, etc.)

- [ ] **Rate Limiting**
  - [ ] Enable rate limiting on API routes
  - [ ] Configure throttling for auth routes
  - [ ] Monitor for abuse patterns

## 🔐 Removed Security Issues

### Fixed: Hardcoded Cloudinary Credentials

**Issue**: The file `cloudinary_test.php` contained hardcoded Cloudinary credentials.

**Resolution**:
- ✅ Removed `cloudinary_test.php` from repository
- ✅ Added `cloudinary_test.php` to `.gitignore`
- ✅ Created `cloudinary_test.php.example` as a safe template
- ⚠️ **IMPORTANT**: If these credentials were in use, they should be rotated immediately

**Action Required**:
If the exposed credentials (`cloudinary://716565799649827:b_Hgj1M3p4LsODE-vjVmUR7dflU@dy9yoeiq2`) were actively used:
1. Log into Cloudinary dashboard
2. Rotate the API secret immediately
3. Update `.env` file with new credentials
4. Never commit actual credentials to version control

## Environment Variables Security

### Required Secrets in .env

These must NEVER be committed:

```env
APP_KEY=                    # Laravel encryption key
DB_PASSWORD=                # Database password
CLOUDINARY_URL=             # Cloudinary credentials
OPENAI_API_KEY=            # OpenAI API key
MAIL_PASSWORD=             # Email password
SESSION_ENCRYPT=true       # Encrypt session data
```

### Verify .env is Excluded

```bash
# Ensure .env is in .gitignore
grep "^\.env$" .gitignore

# Check if .env is tracked by git (should return nothing)
git ls-files | grep "^\.env$"
```

## Image Upload Security

### Current Protections

1. **File Type Validation**
   ```php
   'images.*' => 'file|mimes:jpg,jpeg,png|max:5120'
   ```

2. **Size Limits**
   - Maximum 5MB per image
   - Configured in validation rules

3. **Storage via Cloudinary**
   - Images stored on Cloudinary CDN (not local server)
   - Cloudinary performs additional security checks
   - Automatic malware scanning available

### Recommendations

Consider adding:
- Image dimension validation
- MIME type verification (not just extension)
- Content scanning for malicious code
- User upload quotas
- Rate limiting on upload endpoints

## API Integration Security

### Cloudinary

- ✅ Uses environment variables for credentials
- ✅ Secure HTTPS communication
- ✅ Signed upload requests
- ⚠️ Consider adding upload presets for additional security

### OpenAI

- ✅ API key stored in environment variables
- ✅ HTTPS communication
- ⚠️ Monitor API usage and costs
- ⚠️ Implement rate limiting for AI requests

## Database Security

### SQLite (Development)

- Suitable for development only
- File-based, simple to backup
- Limited concurrent access

### Production Recommendations

For production, consider:
- **PostgreSQL** or **MySQL** for better security
- Connection pooling
- Encrypted connections
- Regular backups
- Point-in-time recovery

## Session Security

Current configuration:
```env
SESSION_DRIVER=database     # Store sessions in DB
SESSION_LIFETIME=120        # 2 hours
SESSION_ENCRYPT=false       # Consider enabling
```

Recommendations:
- Enable `SESSION_ENCRYPT=true` for sensitive data
- Use secure session cookies: `SESSION_SECURE=true` (HTTPS only)
- Implement session timeouts
- Clear expired sessions regularly

## Authentication Security

### Current Setup

- Laravel Fortify for authentication
- Laravel Sanctum for API tokens
- Email verification available
- Password reset functionality

### Best Practices

1. **Password Requirements**
   - Minimum 8 characters (enforced)
   - Consider requiring complexity

2. **Rate Limiting**
   - Login attempts: 5 per minute (Laravel default)
   - Password reset: Limited requests

3. **Two-Factor Authentication**
   - Not currently implemented
   - Consider adding for admin users

## Code Security Practices

### Input Validation

Always validate:
- User input (forms)
- File uploads
- API requests
- Query parameters

### Output Encoding

- React handles XSS automatically
- Be careful with `{!! !!}` in Blade templates
- Sanitize any raw HTML

### Authorization

- Check user permissions before actions
- Verify user owns resources they're modifying
- Use Laravel policies for complex authorization

## Monitoring & Logging

### Current Setup

- Laravel Pail for real-time logs
- File-based logging in `storage/logs/`

### Recommendations

1. **Log Security Events**
   - Failed login attempts
   - Unauthorized access attempts
   - File upload failures
   - API errors

2. **Set Up Monitoring**
   - Application performance monitoring (APM)
   - Error tracking (Sentry, Bugsnag)
   - Uptime monitoring
   - Security scanning

3. **Regular Audits**
   - Review logs weekly
   - Check for suspicious patterns
   - Monitor API usage
   - Review user activity

## Dependency Management

### Keep Dependencies Updated

```bash
# Check for PHP vulnerabilities
composer audit

# Check for JavaScript vulnerabilities
npm audit

# Update dependencies
composer update
npm update
```

### Subscribe to Security Advisories

- Laravel Security: https://github.com/laravel/framework/security
- React Security: https://react.dev/community
- NPM Advisories: https://www.npmjs.com/advisories

## Backup Strategy

### What to Backup

1. **Database**
   - User data
   - Business information
   - Products and images metadata

2. **Environment Files**
   - `.env` (encrypted storage)
   - Configuration files

3. **Uploaded Content**
   - Cloudinary handles image backups
   - Download critical images periodically

### Backup Frequency

- **Production Database**: Daily automated backups
- **Configuration**: On every change
- **Code**: Git version control

## Incident Response

### If Credentials are Exposed

1. **Immediate Actions**
   - Rotate all affected credentials immediately
   - Check for unauthorized access
   - Review recent activity logs
   - Update `.env` with new credentials

2. **Investigation**
   - Determine scope of exposure
   - Check for data breaches
   - Review security logs

3. **Notification**
   - Inform affected users if necessary
   - Document the incident
   - Update security measures

### If Vulnerability is Found

1. **Assess Impact**
   - Severity of vulnerability
   - Potential damage
   - Affected users

2. **Fix Quickly**
   - Develop and test fix
   - Deploy to production ASAP
   - Verify fix works

3. **Post-Mortem**
   - Document what happened
   - How it was found
   - How it was fixed
   - Prevent similar issues

## Security Resources

- **OWASP Top 10**: https://owasp.org/www-project-top-ten/
- **Laravel Security**: https://laravel.com/docs/security
- **GitHub Security**: https://docs.github.com/en/code-security

## Contact

For security concerns, please contact the repository maintainer.

---

**Last Updated**: October 2025  
**Next Review**: January 2026
