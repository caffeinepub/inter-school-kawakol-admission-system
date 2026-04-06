# Inter School Kawakol Admission System

## Current State

A full-stack school admission system with:
- Student registration (Step 1) and admission form (Step 2)
- Admin dashboard with approve/reject actions via modal popup
- Print View and Excel export of applications
- Religion stored in `form.emailId`, Caste stored in `form.mobileNumber` (workaround due to backend schema)
- No rejection reason field in backend Student type
- PrintableAdmissionForm does NOT display Religion or Caste fields
- Excel export (exportToExcel.ts) does NOT include Religion or Caste columns
- Admin reject action calls `rejectApplicationForAdmin(email, adminPassword)` — no reason parameter
- StudentDashboard shows status badge and message, but no rejection reason display

## Requested Changes (Diff)

### Add
- **Rejection Reason input in Admin modal**: When admin clicks "Reject Application", show a text input/textarea for entering a rejection reason before confirming. This reason is stored in `sessionStorage` or `localStorage` keyed by student email (since backend Student type has no rejectionReason field).
- **Rejection Reason display in StudentDashboard**: Below the rejection status badge and message, display the rejection reason if one exists (fetched from localStorage/sessionStorage by student email).
- **Religion column in Excel export**: Add "Religion" column (mapped from `form.emailId`) in exportToExcel.ts.
- **Caste column in Excel export**: Add "Caste" column (mapped from `form.mobileNumber`) in exportToExcel.ts.

### Modify
- **PrintableAdmissionForm**: Add Religion field (reading from `form.emailId`) and Caste field (reading from `form.mobileNumber`) to the Personal Details section, right after Category.
- **AdminDashboard modal**: Add rejection reason textarea that appears when rejecting. Store reason to localStorage keyed as `rejection_reason_${email}` after successful rejection.
- **AdminDashboard modal DetailRow**: Fix existing bug — Religion (line 174) currently shows `form.emailId`, Caste (line 175) shows `form.mobileNumber` — these are actually correct for the popup but labels confirm it.
- **StudentDashboard**: When status is "rejected", read `rejection_reason_${student.email}` from localStorage and display it below the status message.

### Remove
- Nothing removed.

## Implementation Plan

1. **AdminDashboard.tsx** — ApplicationDetailModal:
   - Add `rejectionReason` state (string) inside the modal component
   - When "Reject Application" button is clicked, first show a textarea asking for rejection reason (could be a sub-step: show textarea + confirm button, or use a prompt pattern)
   - On confirm reject: save `localStorage.setItem('rejection_reason_' + email, rejectionReason)` then call `onReject(email)`
   - Keep the approve button unchanged
   - Also fix the handleReject in AdminDashboard (table row quick reject button) — show a simple prompt or inline textarea before rejecting

2. **StudentDashboard.tsx** — Status section:
   - After `getStatusMessage()` display, when `student.status === 'rejected'`, read `localStorage.getItem('rejection_reason_' + student.email)`
   - If reason exists, display it in a red/orange callout box labeled "Rejection Reason" / "अस्वीकृति का कारण"

3. **PrintableAdmissionForm.tsx** — Personal Details section:
   - After the Category `<Field>`, add:
     - `<Field label="Religion (धर्म)" value={form.emailId} />`
     - `<Field label="Caste (जाति)" value={form.mobileNumber} />`

4. **exportToExcel.ts** — After "Category" column:
   - Add header "Religion" and "Caste"
   - In rows map, after `form?.category || ""`, add `form?.emailId || ""` and `form?.mobileNumber || ""`
