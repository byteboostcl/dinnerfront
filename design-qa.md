# Design QA

Target: Hermosillo registration screen shown after clicking the Hermosillo card.

Reference: `/var/folders/t2/hjw23cq57gb0dvr4sgwfndd40000gn/T/codex-clipboard-cff2da06-ab0b-47d0-97e5-46af1f989e02.png`

Implementation checked: `http://127.0.0.1:4200/hermosillo` at 390x844.

## Checks

- The page is rebuilt as layered HTML/CSS, not a direct poster image.
- Clean background loads from `assets/images/city/hermosillo-registration-bg.png` using the supplied Hermosillo sunset image.
- Real form controls are visible and styled directly: full name, email, guest count, and submit.
- Desktop 1440x900 shows the complete registration view in the first viewport.
- Mobile 390x844 shows the complete registration view in the first viewport.
- Global WhatsApp floating button is hidden on `/hermosillo` so it does not cover the registration CTA or footer note.
- Home Hermosillo CTA navigates to `/hermosillo` and the rebuilt registration view loads.
- Production build passes with `npm run build`.

Final result: passed.
