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
