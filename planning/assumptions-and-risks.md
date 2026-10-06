# Assumptions and Risks

## Top Assumptions

1. Each grade sheet's activity title, teacher-page material text, nomenclature, and quantity fields provide the correct material rows for the prototype.
2. The owner confirms that explicit per-student and per-class quantities may be calculated as written; other quantity expressions need separate rules.
3. A local proof is useful while an internal shared-hosting and access-control model is selected.

See [PRD-lite validation checkpoints](prd-lite.md#assumptions-and-validation-checkpoints) for how each assumption will be tested.

## Pre-Build Risk Audit

### Security and Privacy

- No hardcoded secrets, API keys, credentials, or personal data in source files.
- Keep local workbook files and exports out of Git by default; review sensitivity before sharing or committing any transformed data.
- Treat uploaded workbooks as untrusted input. Do not execute macros or embedded code.
- Prefer read-only handling of the source inventory in the first slice.
- Do not expose a shared dashboard until hosting, access control, and data ownership are approved.

### Technical and Data Risks

- **No inventory counts:** None of the nine workbook sheets has an on-hand stock field, so availability and shortage calculations are unsupported.
- **Different grade schemas:** Grade K uses `Q` for `Qty.`, Grade 1 uses `Q` for `Qty./group`, Grade 2 uses `P` for `Quantity per Group`, Grades 3-4 use `Q` for `Qty.`, and Grade 5 uses `R` for `Qty.`. Parsing every grade as one table would misread data.
- **Ambiguous quantities:** Grade K has 39 blank quantities among 97 populated data rows. Values include `1/student`, `1/class`, per-group strings, bare numbers, ranges, and approximations. Applying one multiplier to all values could over- or under-estimate needs.
- **Unit and rounding semantics:** Values can include units such as pairs, rolls, sets, cups, and item ranges. Conversion, package rounding, and class/group interpretation need owner confirmation.
- **Public workbook exposure:** The workbook is tracked at the root of the public GitHub repository. Confirm public distribution is permitted; if not, removal requires addressing the repository history, not only deleting a new copy.
- **Data quality:** Blank fields, inconsistent labels, alternate material-name columns, and differently structured grade tabs may make imports incomplete or create duplicates.
- **Staleness and ownership:** A shared view can mislead if the published data is old or the update owner/process is unclear.
- **Hosting mismatch:** The local prototype does not provide a shared canonical dataset. GitHub is public, not an approved internal data service.

### Mitigations

- Map each grade from its own headers; keep Grade 1-2 per-group quantities unresolved until group-size and rounding rules are approved.
- Calculate only owner-approved, explicit quantity forms; preserve unsupported source text and label it unresolved.
- Confirm material name fields, units, and scaling with the owner; manually verify normal and boundary examples.
- Distinguish missing, invalid, and zero values in data and UI.
- Reject or clearly report unsupported workbook structures rather than silently dropping rows.
- Do not claim stock availability or shortage until an authoritative stock source exists.
- Confirm public sharing permission and select approved internal hosting before implementing shared publication.

## Pre-Build Checklist

- [x] Place a reviewable workbook copy under `data/`.
- [x] Inventory sheet names, grade-specific quantity columns, formula count, and stock fields.
- [ ] Confirm public GitHub distribution is permitted; if not, remove the workbook from public history using an approved process.
- [x] Map activity, teacher-page material, nomenclature, and quantity columns across all six grade sheets.
- [ ] Confirm the source-field mappings and quantity semantics for all six grade sheets with the owner.
- [ ] Confirm how bare numbers, ranges, approximations, and per-group quantities should scale.
- [ ] Hand-check class-size 1 and a representative larger class for each supported rule.
- [ ] Decide how the owner publishes updates and how internal stakeholders access the canonical dataset.
- [ ] Identify an authoritative stock source before planning availability/shortfall features.
- [ ] Define malformed-file and missing/unsupported-quantity messages before enabling import.