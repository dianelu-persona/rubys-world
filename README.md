# Ruby's World

Repo and local folder name: **`rubys-world`**. One HTML page, CSS, and a small script. No build step.

## View locally (macOS)

From this folder:

```bash
open index.html
```

Or drag `index.html` into a browser.

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
git add -p   # or: git add index.html styles.css script.js README.md
git commit -m "Describe your change"
git push
```

## GitHub Pages (optional)

1. Repo on GitHub → **Settings** → **Pages**.
2. **Source**: **Deploy from a branch** → branch **`main`**, folder **`/` (root)** → **Save**.

Site URL shape: `https://dianelu-persona.github.io/rubys-world/` (exact URL is on the Pages settings page).
