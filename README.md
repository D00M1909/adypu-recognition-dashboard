# Recognition Dashboard

NAAC readiness for a college's IQAC, starting with Attribute 4 (Financial
Resources & Management, 50 marks) of the NAAC Binary Accreditation Framework.

- **Two ways in:** type into the workbook on the site, or fill the Excel
  template and upload it (or drop it anywhere on the metric page). Both run
  the template's own formulas, so the results match Excel.
- **Every sheet of the template** is on the site: input sheets, summary with
  chart, document checklist, CA certificate, and the guidelines under
  "How to fill this".
- **Download** writes the data back into the template, ready for the CA.
- **Overview** shows each metric's standing on a readiness dial, with its
  headline ratio or options met.
- **Customise** sets the college's name, crest and colours. The name also
  fills the cover and CA certificate of downloaded workbooks.
- `Ctrl K` (or `/`) jumps to any metric, sheet or action.
- Light and dark themes. Sample data shows how filled workbooks look.
- Data and branding are saved in the browser for now (`src/lib/persist.ts`).

## Develop

```
npm install
npm run dev
```

`npm run build` writes the site to `dist/`. Built with Vite, React,
TypeScript, Tailwind and Motion.

## Templates

`public/templates/` holds the four metric workbooks (4.1 to 4.4) with the
university name replaced by placeholders. The app reads them through
`src/data/workbooks.json`, which is generated, as is the sample data:

```
python tools/clean_templates.py <folder with the source workbooks>
python tools/extract_workbooks.py
python tools/make_sample.py
```

Run the last two whenever a template changes.
