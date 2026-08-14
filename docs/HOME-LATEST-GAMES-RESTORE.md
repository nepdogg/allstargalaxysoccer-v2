# Home Latest Games Carousel Restore

This update restores **Latest Games** to the Home page without changing the locked shared framework.

## Final Home layout

1. Shared masthead / status / hero (unchanged)
2. Latest Games carousel (Home-only)
3. Explore the Allstar Galaxy six guided-navigation cards (existing content retained)
4. Shared footer (unchanged)

## Data source

The carousel reads `data/master-content.json` and automatically selects published games from the newest season in the `latest` group. This means future current-season games appear without editing `home.js`.

Selecting a game card opens a video chooser for Full Match, Highlights, and Slideshow. Missing `#` links display as Coming Soon.

## Framework isolation

Only these Home-specific files are changed:

- `js/pages/home.js`
- `css/pages/home.css`

No shared header, navigation, status-bar, hero, footer, or theme framework files are changed.
