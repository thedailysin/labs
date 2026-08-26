# Google Sheets content setup

## Connect the sheet

1. Put the project table in the first tab of a Google Sheet.
2. Share it as **Anyone with the link — Viewer**, or use **File → Share → Publish to web**.
3. Copy the Sheet URL into `assets/sheet-config.js`.
4. Commit that one changed file to GitHub.

The website loads the Sheet each time a page opens. If Google Sheets cannot be reached, the bundled project data is used as a fallback.

## Columns

Keep these headings exactly:

`Priority, Projects, Discipline, Sector, Client, Roles, Desc, About the Project, The Challenge, The Solution, Blurbs, Tools used, Collaborators, D, M1, M2, M3, M4, M5, M6, M7, M8, M9, M10, M11, M12, M13, M14, M15, M16, M17, M18, M19, M20, M21, M22, M23, M24, M25, M26, M27, M28, M29, M30, M31, M32, M33, M34, M35, M36, M37`

- Use commas, semicolons, or new lines for multiple Disciplines, Sectors, Roles, Tools, and Collaborators.
- Put each blurb on a new line. `||` can also separate blurbs.
- Priority must be a number. Higher numbers appear first within matching category pages.
- **M1 is the publication switch.** A row with an empty M1 is hidden from the homepage, category pages, project pages, and project navigation.
- As soon as M1 contains a valid media URL, the project qualifies for the website automatically on the next page load.
- M1 is always the homepage cover. The optional `D` column remains the category-page display image; when `D` is blank, M1 is used there too.
- No generated placeholder artwork is shown for unpublished or missing media.

## Media notation

- `F|https://...` — full width
- `H|https://...` — half width; consecutive half-width items sit together
- `O|https://...` — original aspect ratio, centred within the content grid
- `V|https://...` — Vimeo or YouTube embed

The earlier comma notation (`F,https://...`) is also accepted, but the pipe format is recommended because it is clearer inside a CSV-backed system.
