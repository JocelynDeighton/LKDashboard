# Phase 1–2 Plan: Labs & Kits Dashboard

**Updated:** 2026-10-06
**Status:** Phase 1 baseline committed as `fdfaecb`; Phase 2 planning documents are created, with workbook-grounded discovery pending workspace access.

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

The attached `Copy of Texas K-5 Materials Tracker.xlsx` is not present as a readable workspace file. The attachment view exposed only the ZIP/XLSX header, not worksheet contents. A local, reviewable copy is needed at `data/Copy of Texas K-5 Materials Tracker.xlsx` before the schema and quantity rules can be verified.

## Stop Point

After Phase 1 and Phase 2 validation, present the created files, baseline checks, workbook findings or blocker, and open decisions for review. Do not proceed to workbook import, calculations, inventory editing, or later lifecycle phases until the user confirms.

## Validation Record

- VS Code reported no errors for the HTML, CSS, and planning Markdown files.
- All local `href` and `src` references in `index.html` resolve to project files.
- The staged whitespace check passed; the initial commit contains only the nine project files listed in Git history.
- The page has not been rendered in an automated browser in this environment; `README.md` documents opening it directly in a modern browser.
- Git confirms `data/Copy of Texas K-5 Materials Tracker.xlsx` is ignored. The workbook itself remains unavailable for inspection.