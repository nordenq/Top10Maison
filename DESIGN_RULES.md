# Top10Maison Design Rules (Locked)

These rules are mandatory for all pages and components. Any exception requires explicit design approval.

## 1. Background System (LOCKED)

Exactly TWO allowed section backgrounds:

### A) DEFAULT BACKGROUND (Primary)
- Color: pure white
- Usage: 80–85% of all page content
- Purpose: reading, comparison, scanning
- Token: `--bg-page` / class: `bg-page`

### B) SOFT TINT BACKGROUND (Secondary)
- Color: very light green / sage tint
- Usage: max 15–20% of a page
- Purpose: section framing, editorial emphasis
- Token: `--bg-soft` / class: `bg-soft`

Rules:
- Never stack two tinted sections consecutively.
- Never tint text-heavy sections.
- Never tint product cards.
- Never tint FAQ sections.

## 2. Green Usage Rules

Green refers to brand green accents. The only approved green background is the soft tint (`--bg-soft`) defined above.

Green may ONLY be used for:
- Primary CTA buttons
- Status / ranking pills (Best Overall, Best Value, etc.)
- Icons inside cards
- Hover / focus states

Green MUST NOT be used for:
- Full-width content sections (except `--bg-soft`)
- Reading-heavy blocks
- Product lists
- FAQs
- Tables
- Image overlays

## 3. Card Rules

- Cards must always be white.
- Cards inside tinted sections must remain white.
- Cards must not nest inside other cards.
- Cards must not be used only for spacing.

## 4. FAQ Rules (Global)

All FAQs (guide + product) must:
- Use white background
- Use divider lines or borders, not background fills
- Use the same accordion style site-wide
- Only use green for:
  - Chevron icon
  - Focus/active state

## 5. Image Rules

- Images must be centered using `object-fit`.
- No overlays, gradients, or tinted backgrounds on images.
- Image containers may be neutral gray only if needed for contrast.
- Ranking badges (#1, Best Overall) must not overlap image content.

## 6. Page Type Background Map

### Home Page
- Hero: white
- Featured sections: alternating white / tinted
- Never more than 2 tinted sections total

### Category Pages
- Hero: white
- Category cards: white
- Optional ONE tinted grouping section

### Subcategory Pages
- Same rules as Category pages
- No additional tint usage

### Buying Guide / Top List Pages
- Content sections: white
- Editorial sections ("Why", "How we picked"): optional tint (max 2)
- Product lists: always white

### Product Detail Pages
- Entire page: white
- No tinted sections
- FAQs: white only

## 7. Implementation Notes

### Quick Checklist
- Only two backgrounds exist: `bg-page` and `bg-soft`.
- `bg-soft` is used sparingly and never back-to-back.
- Cards stay white everywhere.
- FAQs are always white with dividers, never filled.
- Green is reserved for CTAs, status pills, icons, and states.

Lintable convention:
- Use `section--soft` on any tinted section and avoid `bg-soft` directly in markup.

### Do / Don’t

Do:
- Use `bg-soft` only to frame a major editorial block.
- Keep product lists and FAQs on white.
- Keep cards white and flat inside any section.

Don’t:
- Don’t tint long reading sections.
- Don’t apply green to full-width sections (except `bg-soft`).
- Don’t add new background variants.
- Don’t nest cards or use them as spacers.

### Optional Class Naming (Semantic)
- `page`, `section`, `section--soft`
- `card`, `card__media`, `card__badge`
- `faq`, `faq__item`, `faq__question`, `faq__answer`
- `reading-guide`, `reading-guide__links`
