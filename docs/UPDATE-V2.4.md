# Allstar Galaxy V2.4 Update

This code-focused update:

- separates the desktop identity row from navigation spacing;
- prevents navigation glows from overlapping the logos;
- restores the galaxy as the global page background;
- makes the page body and footer translucent;
- generates hero dots from any number of configured images;
- adds an unlimited hero-list editor in `admin/index.html`;
- adds the dedicated `explore.html` discovery hub;
- changes the Explore navigation destination to the new page;
- includes the supplied Explore hero image;
- adds comments to every changed code file.

## Install with GitHub Desktop

1. Extract this ZIP.
2. Copy all extracted contents into the local `allstargalaxysoccer-v2` folder.
3. Allow Windows to replace matching files.
4. Do not delete the existing `assets` folder. This package only adds the new Explore hero.
5. In GitHub Desktop, commit with:
   `Install V2.4 Explore and universal framework update`
6. Click **Push origin**.
7. Wait for GitHub Pages to rebuild and hard-refresh.

## Hero carousel

Each page controls its images in `data/pages/<page>.json`.

```json
"hero": [
  "assets/images/heroes/pages/image-1.png",
  "assets/images/heroes/pages/image-2.png"
]
```

The number of carousel dots always matches the number of image paths. There is no fixed three-image limit.
