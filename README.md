# Allstar Galaxy Platform Foundation V1

This is a clean, mobile-first GitHub Pages foundation built from the current Allstar Galaxy repository assets and data.

## Isolation rule

Each page owns exactly three files:

- `data/pages/<page>.json` — page accent, active navigation, ticker, hero artwork
- `css/pages/<page>.css` — page content only
- `js/pages/<page>.js` — page content and behavior only

Page files must not style or alter `.site-frame`, `.identity-row`, `.main-nav`, `.status-bar`, `.hero`, or `.site-footer`.

## Shared changes

- Shared layout: `css/components.css`, `css/base.css`
- Shared header/hero/footer rendering: `js/site-frame.js`
- Shared site configuration: `data/site-config.json`

Changing a shared component changes it across the entire site. Changing a page module changes only that page.

## Current migration status

- Foundation and all public shells: complete
- Home foundation module: included
- Team foundation module: included
- Remaining detailed legacy page content: intentionally staged for migration
- Admin: page configuration editor foundation included

## Safe deployment

Test this repository in a new GitHub repository or branch before replacing production. Keep the current repository as a legacy archive until feature migration is complete.


## V2.2 navigation and search update
- Universal six-button navigation with accessible submenus.
- Search is a standard white/platinum page with its own hero and search interface.
- Only the universal header is sticky; hero artwork scrolls with page content.
- Universal footer and desktop/mobile navigation were standardized.

## V2.2 shared header update

- Desktop identity row now uses an Allstar Galaxy logo on both sides of the navigation title.
- Search is a standard desktop navigation button.
- The circular Search control is reserved for phone layouts.
- Desktop navigation spans the full shared header width.
- The status module now has permanent top and bottom accent borders.
- White/silver energy bars move in opposite directions inside those borders.
- Footer navigation and social links use the shared site configuration.

---

## V2.3 universal framework update

The current architecture is documented in `docs/DEVELOPER-GUIDE.md`.

The downloadable update package is code-only: it intentionally does not contain the
large `assets/` image library. Copy the update over the existing repository and keep
all existing images in place.
