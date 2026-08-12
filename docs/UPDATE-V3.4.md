# Allstar Galaxy V3.4 — Framework Locked

This release locks the shared visual framework.

## Final footer hierarchy
- Upper row: Xitlali Media branding, primary public navigation, social links.
- Accent divider immediately below the primary row.
- Lower utility row: Contact Administrator left, copyright center, About and Administration right.
- Strong bottom accent rail remains the final page frame.

## Latest Update status bar
The public status bar now reads `data/latest-update.json` on every page. Edit one file to promote the newest game/video across the entire site. The center message is the only link; edge labels are visual pointers.

A future Media Administration publish workflow can update `data/latest-update.json` automatically when new media is published.

## Framework lock rule
After V3.4, page-by-page development should not modify `css/components.css`, `js/site-frame.js`, or the shared footer/header structure unless correcting a genuine framework bug. Page work belongs in each page's isolated CSS, JS, and JSON modules.
