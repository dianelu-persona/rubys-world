# Ruby's World

Repo and local folder name: **`rubys-world`**. Static HTML, CSS, and scripts. No build step.

Pages: **`index.html`** (home), **`map.html`** (map with hiking routes and search).

## View locally

### Home page only (`file://`)

From this folder:

```bash
open index.html
```

Or drag `index.html` into a browser.

### Map page and route files (`fetch` to GeoJSON)

Browsers often block loading `routes/*.geojson` when the page is opened as a `file://` URL. Use a local HTTP server from the project root:

```bash
cd ~/projects/rubys-world
python3 -m http.server 8080
```

Then open **http://localhost:8080/** for the home page and **http://localhost:8080/map.html** for the map.

## Map: tiles, search, and data

- **Basemap:** [OpenStreetMap](https://www.openstreetmap.org/copyright) tiles (attribution shown on the map).
- **Search:** [Nominatim](https://nominatim.org/) (OpenStreetMap’s search). Use the search box and press **Search** or **Enter**. Requests are throttled to stay within [fair-use guidelines](https://operations.osmfoundation.org/policies/nominatim/); do not automate high-volume queries.
- **Hiking routes:** [GeoJSON](https://geojson.org/) files. Shipped routes live in **`routes/`** and are listed in **`map.js`** (`STATIC_ROUTE_URLS`). You can add more files to that folder and append their paths there. Use **`FeatureCollection`** or a single **`Feature`**; line routes are usually **`LineString`** / **`MultiLineString`**; include a **`name`** (or **`title`**) in **`properties`** for popups.

To try extra routes without editing the repo, use **Add routes (GeoJSON)** on the map page and select one or more `.geojson` files from your computer (session only unless you add them to the project).

Default map center and zoom are set at the top of **`map.js`** (`DEFAULT_CENTER`, `DEFAULT_ZOOM`).

## Git: clone

```bash
git clone https://github.com/dianelu-persona/rubys-world.git
```

## First-time setup (if you clone empty folder)

Create an empty repo **`rubys-world`** on GitHub, then:

```bash
cd ~/projects/rubys-world
git remote add origin https://github.com/dianelu-persona/rubys-world.git
git push -u origin main
```

### GitHub CLI (optional)

```bash
gh auth login -h github.com
cd ~/projects/rubys-world
gh repo create rubys-world --public --source=. --remote=origin --push
```

Use `--private` instead of `--public` if you prefer.

## Day-to-day changes

```bash
git add -p
git commit -m "Describe your change"
git push
```

## GitHub Pages (optional)

1. Repo on GitHub → **Settings** → **Pages**.
2. **Source**: **Deploy from a branch** → branch **`main`**, folder **`/` (root)** → **Save**.

Site URL shape: `https://dianelu-persona.github.io/rubys-world/` (exact URL is on the Pages settings page). The map and `routes/*.geojson` work over HTTPS the same as with a local server.
