# Allstar Galaxy V2.5 — Header and Administration Update

## Public website changes

- The desktop identity row is taller so the navigation-title artwork can be larger.
- Both Allstar Galaxy logos are moved closer to the outer edges.
- The seven public navigation buttons extend almost edge to edge and use equal widths.
- Additional vertical space prevents logo/title glow from overlapping the navigation.
- All changes remain universal because they are located in `css/components.css`.
- The public footer now includes an Administration link.

## Administration platform

The Administration area is available at:

`admin/index.html`

It includes:

- A dedicated gold administration masthead.
- Administration-only navigation.
- Animated administration status bar.
- Administration hero area.
- Dashboard cards for Content, Team, Media, Updates, Website, and Diagnostics.
- A View Site button.
- An unlimited page hero-list editor.
- JSON download workflow for GitHub Desktop.

## Administration hero artwork

The repository contains `assets/images/heroes/pages/hero-admin.png` as a functional default. Replace that file with the final supplied Administration hero artwork while keeping the same filename. No HTML, CSS, or JSON changes are required after replacing it.

## GitHub Pages limitation

GitHub Pages is static. The Administration editor downloads replacement JSON files but cannot safely publish directly to the repository without authentication and a server-side service.

## Installation

This package is a complete repository. Replace the contents of the local GitHub Desktop repository with this version, commit, and push to `main`.
