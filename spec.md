# Inter School Kawakol Admission System

## Current State
- Step 1 registration: Class, Name, Email, Password fields with basic email format validation only
- Login page: Email + Password fields, no forgot password option
- No OTP verification at any step
- Email feature is DISABLED on this plan (no real email sending capability)

## Requested Changes (Diff)

### Add
- Email OTP verification step in Step 1 Registration:
  - After filling email, student clicks "Send OTP" button
  - OTP is generated (6-digit) and stored in backend with expiry
  - Since email is disabled, OTP is shown in a toast/alert on screen (simulated delivery)
  - Student enters OTP in a new input field
  - Registration proceeds only after OTP is verified
- Forgot Password flow accessible from Login page:
  - "Forgot Password?" link on login page
  - Student enters registered email → clicks "Send OTP"
  - OTP generated, shown on screen (simulated)
  - Student enters OTP + new password + confirm password
  - Password reset saved to backend
- New backend functions:
  - `generateOtp(email: Text) : async Text` — stores OTP with 10-min expiry, returns OTP (for simulation display)
  - `verifyOtp(email: Text, otp: Text) : async Bool` — validates OTP
  - `resetPassword(email: Text, otp: Text, newPassword: Text) : async ()` — verifies OTP then updates password
- New frontend page: `ForgotPasswordPage.tsx`
- New route `/forgot-password` in App.tsx

### Modify
- `RegisterPage.tsx`: Add OTP verification flow — after email is entered, user must verify via OTP before completing registration
- `LoginPage.tsx`: Add "Forgot Password?" link below the login form
- `main.mo`: Add OTP storage map and three new functions
- `backend.d.ts`: Add new OTP function signatures
- `backend.did.js`: Add new function IDL entries
- `App.tsx`: Add `/forgot-password` route

### Remove
- Nothing removed

## Implementation Plan
1. Add OTP storage (stable map of email → {otp, expiry}) in main.mo
2. Add `generateOtp`, `verifyOtp`, `resetPassword` functions to main.mo
3. Update backend.d.ts with new function types
4. Update backend.did.js with new IDL entries
5. Update RegisterPage.tsx: add "Send OTP" button after email field, OTP input, verify step before registration
6. Create ForgotPasswordPage.tsx with full email → OTP → new password flow
7. Update LoginPage.tsx with Forgot Password link
8. Update App.tsx with /forgot-password route
