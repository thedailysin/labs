# Google Sheets content setup

## Connect the sheet

1. Put the project table in the first tab of a Google Sheet.
2. Share it as **Anyone with the link — Viewer**, or use **File → Share → Publish to web**.
3. Copy the Sheet URL into `assets/sheet-config.js`.
4. Commit that one changed file to GitHub.

The website loads the Sheet each time a page opens. If Google Sheets cannot be reached, the bundled project data is used as a fallback.

## Columns

Keep these headings exactly:

`Priority, Projects, Discipline, Sector, Client, Roles, Desc, About the Project, The Challenge, The Solution, Blurbs, Tools used, Collaborators, D, M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13, M14, M15, M16, M17, M18, M19, M20`

- Use commas, semicolons, or new lines for multiple Disciplines, Sectors, Roles, Tools, and Collaborators.
- Put each blurb on a new line. `||` can also separate blurbs.
- Priority must be a number. Higher numbers appear first within matching category pages.
- The first valid media item becomes the homepage and category-page cover.

## Media notation

- `F|https://...` — full width
- `H|https://...` — half width; consecutive half-width items sit together
- `O|https://...` — original aspect ratio, centred within the content grid
- `V|https://...` — Vimeo or YouTube embed

The earlier comma notation (`F,https://...`) is also accepted, but the pipe format is recommended because it is clearer inside a CSV-backed system.
