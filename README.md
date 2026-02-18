# Getwize – Company Website

Small company site with vanilla CSS and TypeScript. Used for selecting and previewing **color variants** (menu items = variants; more coming later).

## Local development

- Open `index.html` in a browser, or run a static server, e.g.:
  - `npx serve .`
  - `python3 -m http.server 8000`
- Build TypeScript after editing `ts/main.ts`: `npm install && npm run build`

## Color guide (CSS variables in `css/styles.css`)

| Variable | Purpose | Current value |
|----------|---------|----------------|
| `--color-primary` | Main brand, key UI | `#7b9da7` |
| `--color-secondary` | Strong contrast, text, dark areas | `#000000` |
| `--color-background` | Page/section backgrounds | `#ffffff` |
| `--color-neutral` | Supporting elements, borders | `#9e8415` |
| `--color-accent` | Highlights, CTAs, important links | `#c02326` |
| `--color-text` | Body text | `#000000` |

To add a new variant, duplicate the `:root` block (or use a class on `html`) and override these variables.

## Repository

- GitHub: [Grafikmartin/getwize](https://github.com/Grafikmartin/getwize)  
- Clone: `git clone git@github.com:Grafikmartin/getwize.git`
