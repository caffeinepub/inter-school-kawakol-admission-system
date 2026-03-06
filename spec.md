# Specification

## Summary
**Goal:** Add a Declaration section at the end of the admission form displaying both English and Hindi declaration text, with a bilingual acknowledgement checkbox tracked in form state.

**Planned changes:**
- Create or update the `GuardianDeclarationSection` component to display the full English declaration text followed by the full Hindi declaration text (in Devanagari script)
- Add a checkbox below the declaration texts with bilingual label ("I / We have read and agree to the above declaration" / "मैंने/हमने उपरोक्त घोषणा पढ़ी है और सहमत हैं")
- Track the checkbox state in the form state object
- Integrate `GuardianDeclarationSection` as the final section in `AdmissionFormPage.tsx`, with its checkbox value included in save-draft and submit actions
- Style the section consistently with existing form section card layout

**User-visible outcome:** Users filling out the admission form will see a Declaration section at the very end, showing the full declaration in both English and Hindi, and can check a box to acknowledge agreement. The checkbox value is saved along with the rest of the form data.
