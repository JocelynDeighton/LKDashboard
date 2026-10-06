# Execution Plan: Labs & Kits Dashboard

**Updated:** 2026-10-06

**Status:** Phase 4 local Grades K-5 prototype implemented; workbook-owner validation remains open.

## Phase 1: Locked First Slice

### Goal

Prove a local, read-only flow using the real workbook: load it, select a grade and activity, enter class size, and calculate only quantities whose scaling is explicit and owner-approved. Clearly flag every unsupported quantity. This is a curriculum requirements calculator, not an inventory availability dashboard.

### Pilot Data

Use Grade K activity `One Potato, Two Potato` for acceptance examples. In the source, `hand lens` is `1/student`, `hot plate` is `1/class`, and `heat-resistant gloves` is `1 pair/class`, while `sweet potato` is `2` and `paper towel` is `1` without a stated basis. Do not calculate the bare numeric values until their meaning is confirmed.

### Required Components

- Local workbook file picker; the workbook is processed in the browser and is not uploaded.
- A maintained XLSX parsing library, pinned to a reviewed version; no framework or backend.
- Grade-specific adapters for all six grade sheets, mapping activity title, teacher-page material, nomenclature, grouping, and quantity fields from headers.
- Grade and activity selection and a positive whole-number class-size input.
- A small explicit rule interpreter for owner-approved per-student and per-class expressions, preserving units.
- Per-group quantities remain unresolved until group size and partial-group rounding are defined.
- Results that show the source quantity text and distinguish calculated values from blank, unsupported, or ambiguous quantities.
- Accessible loading, validation, and parsing-error messages.

### Intentional Stubs and Deferrals

- No authentication, roles, backend, database, central publishing, or shared data synchronization.
- No inventory editing, stock-on-hand comparison, or shortage labels; no stock data exists in the workbook.
- No calculations for bare numbers, ranges, approximate amounts, per-group values, or unknown units until rules are confirmed.
- Parsing is capped at rows 1-250 per grade worksheet; rows beyond the cap are not inspected.
- Styling remains restrained and functional; visual polish follows the data workflow.

### Testable Acceptance Criteria

- Selecting the owner-approved workbook loads Grade K-5 activity lists using each sheet's own headers; malformed or unsupported files produce a specific, recoverable message.
- Selecting `One Potato, Two Potato` and entering class size 1 yields 1 hand lens for `1/student`, subject to owner-confirmed rules.
- At a larger owner-approved class size, the per-student amount scales by that count; explicit per-class quantities remain fixed and preserve units.
- Grade 1-2 per-group quantities remain unresolved unless group size and rounding are defined and approved.
- `sweet potato: 2` and `paper towel: 1` display their original values as unresolved and are never multiplied or treated as stock.
- Blank quantities remain visibly unknown, not zero. Invalid class-size inputs (blank, zero, negative, decimal, or nonnumeric) do not produce a calculation.
- The source workbook is unchanged and no network request sends its contents to a server.
- Expected values are hand-checked with the workbook owner before being treated as acceptance truth.

## Phase 2: Expand Core

- Confirm the material and quantity semantics for each grade before operational use; the current adapters expose their source fields without assuming uniform quantity meaning.
- Add per-group calculations only after the owner defines group size and how a partial group rounds.
- Add normalization for units, ranges, and package sizes only where authoritative rules exist.
- Add a reviewed inventory-on-hand source before implementing stock comparisons or shortages.
- Define an approved internal publishing and access-control design for the designated owner and stakeholder viewers.

## Phase 3+: Future Roadmap

- Internal shared dashboard with owner publishing, authentication/authorization, freshness metadata, and approved hosting.
- Multi-location inventory, stock updates, audit trail, and concurrent editing if required.
- External stakeholder access, purchasing integrations, replenishment, and export/report workflows.
- Broader grade coverage and curriculum-version comparison after the source model is stable.

## Pre-Build Gate

- Confirm the workbook may remain in the public GitHub repository; if not, remove it from public history through an approved process before further publishing.
- Confirm the source columns and quantity semantics for all six grade sheets with the owner.
- Confirm the class-size test values and manually verify expected results for each supported rule.
- The local prototype may be reviewed, but do not treat calculated outputs as validated until the workbook owner confirms the supported quantity rules and test values.