# Labs & Kits Dashboard

A local, read-only Grades K-5 materials pilot for reviewing curriculum source quantities and calculating narrowly supported class requirements.

## Quick Start

Open `index.html` in a modern browser, choose the reviewed `.xlsx` workbook, select a grade and activity, and enter a positive whole-number class size. The workbook is read in the browser and is not uploaded.

The page loads the pinned SheetJS 0.20.3 browser library from its official CDN, so an internet connection is required to load the parser. No install or build step is required.

## Current Scope

- Reads the `Grade K` through `Grade 5` worksheets, capped at rows 1-250 per sheet, and maps fields by each sheet's headers.
- Calculates only explicit `n/student` and `n/class` quantities, including a stated unit, after the user affirms that the rules for the selected grade were verified with the workbook owner.
- Keeps Grades 1-2 per-group quantities unresolved because group size and partial-group rounding are not defined.
- Keeps blank quantities, bare numbers, missing material names, and other unsupported expressions visible and unresolved.
- Does not compare against stock or report availability or shortages.

The confirmation checkbox is an operator attestation, not an authorization system. Do not treat its calculations as operationally approved until the workbook owner confirms the rules. The parser intentionally does not inspect rows after 250 on any sheet.

See [STATUS.md](STATUS.md) for verification details and remaining limitations. See [`planning/`](planning/) for the product scope, decisions, and risks.