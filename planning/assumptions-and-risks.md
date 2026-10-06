# Assumptions and Risks

## Top Assumptions

1. The workbook has stable identifiers and fields that connect a lab or kit to its materials and quantities.
2. Quantity rules can be interpreted consistently for class size, including any per-team, fixed-per-class, unit conversion, and rounding cases.
3. A designated owner can publish a canonical dataset through an internally approved hosting and access-control path.

See [PRD-lite validation checkpoints](prd-lite.md#assumptions-and-validation-checkpoints) for how each assumption will be tested.

## Pre-Build Risk Audit

### Security and Privacy

- No hardcoded secrets, API keys, credentials, or personal data in source files.
- Keep local workbook files and exports out of Git by default; review sensitivity before sharing or committing any transformed data.
- Treat uploaded workbooks as untrusted input. Do not execute macros or embedded code.
- Prefer read-only handling of the source inventory in the first slice.
- Do not expose a shared dashboard until hosting, access control, and data ownership are approved.

### Technical and Data Risks

- **Source unavailable:** The attachment is not currently readable as a workspace file, preventing inspection of its sheets, fields, formulas, and sample records.
- **Ambiguous quantity model:** Quantities may scale per student, per group, per class, or through mixed rules; a simple multiplier could over- or under-order.
- **Incompatible units:** Required and on-hand amounts may use different units or packaging sizes; a comparison is invalid without verified conversion rules.
- **Spreadsheet formula behavior:** Cached formula results can be missing or stale; the displayed value may depend on spreadsheet recalculation.
- **Data quality:** Blank identifiers, duplicate rows, merged headers, inconsistent labels, hidden sheets, or malformed values may make imports incomplete.
- **Staleness and ownership:** A shared view can mislead if the published data is old or the update owner/process is unclear.
- **Hosting mismatch:** A local static page cannot by itself publish shared, centrally updated data; the approved internal environment may require a backend or a reviewed static export.

### Mitigations

- Inspect the actual workbook before designing a parser or calculation model.
- Confirm formulas and units with the owner and manually verify normal and boundary examples.
- Distinguish missing, invalid, and zero values in data and UI.
- Reject or clearly report unsupported workbook structures rather than silently dropping rows.
- Display source and update metadata once a verified publication workflow exists.

## Pre-Build Checklist

- [ ] Place an approved, reviewable workbook copy under `data/` or provide an accessible export.
- [ ] Confirm the workbook may be processed locally and identify any sensitive fields to omit.
- [ ] Map sheets, headers, identifiers, material names, quantities, units, and stock fields.
- [ ] Confirm per-student/per-team/per-class rules, conversions, and rounding with the owner.
- [ ] Hand-check one typical and one boundary class-size calculation.
- [ ] Decide how the owner publishes updates and how internal stakeholders access the canonical dataset.
- [ ] Confirm whether the workbook itself or only a normalized export is the runtime source.
- [ ] Define malformed-file and missing-data messages before enabling import.