# Phase 1–2 Plan: Labs & Kits Dashboard

**Updated:** 2026-10-06
**Status:** Phase 1 baseline and Phase 2 scope are committed and pushed in `73c174a`. Workbook-grounded discovery and Phase 3 execution planning are complete; Phase 4 awaits review and confirmation.

## Goal

Establish a beginner-friendly project baseline and document a testable first slice for a K-12 labs and kits materials dashboard. The planned workflow is to use an owner-approved workbook, select a lab or kit and class size, calculate required quantities, and compare against available stock when the source supports that comparison.

## Phase 1: Repository Baseline

- Use a static, framework-free HTML/CSS project that opens directly in a browser.
- Make `index.html` the clear entry point and show an explicit unconfigured-data state.
- Do not seed example inventory, treat missing stock as zero, or calculate from unverified rules.
- Ignore local workbook exports so sensitive source data is not accidentally committed.
- Initialize Git inside `LK Dashboard/` only; stage and commit only project files.

### Acceptance Criteria

- Opening `index.html` locally renders the baseline without a build or install step.
- The page clearly distinguishes unavailable data from zero inventory and uncalculated requirements.
- The project contains no fabricated inventory or formula output.
- The initial commit, if created, contains only the intentional baseline files and documentation.

## Phase 2: Scope Discovery

- Create the PRD-lite, project decisions, and assumptions/risks documents in `planning/`.
- Define the intended first slice as one owner-provided workbook, one selected lab/kit, a class-size input, required-material totals, and an availability/shortfall comparison when supported by the source.
- Inspect actual sheets, fields, identifiers, units, existing formulas, and representative records before confirming the calculation model.
- Verify normal and boundary examples with the workbook owner; document any rules not encoded in the source.
- Keep the local source workbook out of Git by default.

### Acceptance Criteria

- The PRD contains the requested problem statement, target user/outcome, first slice, explicit exclusions, three assumptions, and validation checkpoints.
- Decisions and risks distinguish confirmed choices from unresolved workbook and hosting questions.
- No workbook-specific fields, quantities, or formulas are represented as confirmed until the source is inspectable.

## Current Blocker
## Workbook Findings

- The workbook has nine worksheets: `Change Tracker`, `Grade K` through `Grade 5`, `Material Types`, and `Sheet1`.
- No worksheet contains Excel formulas or an on-hand/available-stock field. It is a curriculum materials tracker, not an inventory-on-hand ledger.
- Grade tabs do not share a consistent schema. Quantity is in column Q on Grade K and Grades 3-4, column Q with a different heading on Grade 1, column P on Grade 2, and column R on Grade 5.
- Grade K contains 97 populated data rows. Its quantity column is blank on 39 rows; nonblank values include `1/student`, `1/class`, `1 pair/class`, `1 roll/group`, `1 set/group`, bare numbers, `~.25 cup`, and `10-20 items`.
- The `One Potato, Two Potato` activity demonstrates supported and ambiguous cases together: hand lens `1/student`, several `1/class` entries, and bare values such as `2` and `1` whose scaling basis is not stated.
- The workbook exists at both the ignored local path `data/Copy of Texas K-5 Materials Tracker.xlsx` and the tracked repository-root path `Copy of Texas K-5 Materials Tracker.xlsx`. The GitHub repository is public; confirm the workbook is approved for public access.

## Stop Point

After Phase 3 planning and risk review, present the execution plan, workbook findings, and open decisions for review. Do not begin Phase 4 implementation until the user confirms.

## Validation Record

- VS Code reported no errors for the HTML, CSS, and planning Markdown files.
- All local `href` and `src` references in `index.html` resolve to project files.
- The staged whitespace check passed; the initial commit contains only the nine project files listed in Git history.
- The page has not been rendered in an automated browser in this environment; `README.md` documents opening it directly in a modern browser.
- OpenXML inspection confirmed nine worksheets, zero formulas, and no on-hand stock columns; Grade K structure and quantity examples are summarized above.
- Git confirms the local `data/*.xlsx` copy is ignored. A duplicate workbook at the repository root is already tracked in the public GitHub history.