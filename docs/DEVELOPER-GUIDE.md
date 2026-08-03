# Allstar Galaxy V2 Developer Guide

## Architecture rule

The site is split into **shared framework files** and **isolated page files**.

Shared framework changes automatically affect every public page:

- `css/tokens.css` — global variables and normalization
- `css/base.css` — galaxy background and universal glass page shell
- `css/components.css` — header, navigation, status bar, hero, footer
- `js/app.js` — page startup and configuration loading
- `js/site-frame.js` — shared component rendering
- `data/site-config.json` — navigation, footer, logo, background, social links

A change intended for only one page belongs in:

- `data/pages/<page>.json` — accent, hero rotation, title, ticker
- `css/pages/<page>.css` — page-only styling
- `js/pages/<page>.js` — page-only content and behavior

## Adding a page

1. Copy an existing HTML page.
2. Change `body data-page` to a new unique key.
3. Create `data/pages/<key>.json`.
4. Create `css/pages/<key>.css`.
5. Create `js/pages/<key>.js`.
6. Point the HTML file to those two page-only files.
7. Add the page to `data/site-config.json` only when it belongs in navigation.

## Navigation organization

- **Home** — homepage only
- **Team** — roster, profiles, stats, Follow, About
- **Updates** — schedule, results, standings, news
- **Media** — latest games, seasons, Best Of, archive
- **Explore** — Shuffle, awards, random and featured discovery
- **Live** — live stream and upcoming broadcasts
- **Search** — full search page

## Status bar

The status bar has no left or right border. It uses:

- a top accent border and white/silver energy rail moving left to right
- a bottom accent border and white/silver energy rail moving right to left

Edit its shared appearance in `css/components.css` and its page message in the
page JSON file.

## 404 page

`404.html` is a complete standard V2 page. It uses the same shared framework,
hero carousel, galaxy background, glass content shell, and footer. Its recovery
content is isolated in `js/pages/404.js` and `css/pages/404.css`.

## Safe update workflow

1. Make a backup or create a Git branch.
2. Copy the update files into the repository root and allow replacements.
3. Review GitHub Desktop's changed-file list.
4. Commit with a descriptive message.
5. Push Origin.
6. Test PC and phone layouts before merging further changes.
