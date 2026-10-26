# Recognition Dashboard

IQAC tool for NAAC readiness, starting with Attribute 4 (Financial Resources &
Management, 50 marks) of the NAAC Binary Accreditation Framework.

- **Two ways in:** type into the workbook on the site, or fill the Excel
  template and upload it. Both run the template's own formulas, so the
  results match Excel.
- **Every sheet of the template** is on the site: input sheets, summary with
  chart, document checklist, CA certificate, and the guidelines under
  "How to fill this".
- **Download Excel** writes the data back into the template, ready for the CA.
- **Customise** sets the university's name, logo and colours. The name also
  fills the cover and CA certificate of downloaded workbooks.
- Data and branding are saved in each person's browser.

Static site, no build step. Serve the folder with any static server, e.g.
`python -m http.server`.

## Templates

`templates/` holds the four metric workbooks (4.1 to 4.4) with the
university name replaced by placeholders. The site reads them through
`js/naac/workbooks.js`, which is generated:

```
python tools/clean_templates.py <folder with the source workbooks>
python tools/extract_workbooks.py
```

Run the second command whenever a template changes.
