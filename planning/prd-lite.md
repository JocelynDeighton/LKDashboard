# PRD-lite: Labs & Kits Dashboard

## Problem Statement

Instructional designers and K-12 curriculum stakeholders need a trustworthy view of lab and kit materials so they can determine what a class needs and whether available stock is sufficient.

## Primary Target User and Outcome

The primary user is an instructional designer planning K-12 lab and kit curricula. Internal stakeholders need to review the same source of truth. For a selected lab or kit and class size, the intended outcome is a clear list of required materials and any stock shortfalls, based only on verified source data and rules.

## In-Scope First Slice

- Load one owner-approved workbook locally and read the `Grade K` through `Grade 5` sheets with a separate header mapping for each grade.
- Select a grade and activity and enter a positive whole-number class size.
- Calculate quantities only for explicitly supported source expressions: `n/student` scales by class size; `n/class` remains fixed per class. Preserve any stated unit such as `pair`.
- Show source wording and a clear unresolved status for blanks, bare numbers, ranges, per-group quantities, approximations, or other unsupported expressions; never guess a scaling basis. Grade 1-2 per-group quantities remain uncalculated until group size and rounding are defined.
- Keep the source workbook read-only and in the user's browser; do not upload it to a server in this first slice.

### Source Evidence and Constraints

The reviewed workbook has nine sheets, no spreadsheet formulas, and no on-hand stock fields. Its grade sheets contain 97 Grade K, 125 Grade 1, 159 Grade 2, 152 Grade 3, 209 Grade 4, and 193 Grade 5 populated rows. Meaningful source rows end between worksheet rows 99 and 211; the browser parser is capped at row 250 per sheet. Grade 1 uses `Qty./group` in column Q, Grade 2 uses `Quantity per Group` in column P, Grades K and 3-4 use `Qty.` in column Q, and Grade 5 uses `Qty.` in column R. Grade 5 also shifts the activity, teacher-page material, and nomenclature fields to J, O, and P. The other grades use different columns/headings for some metadata, so the implementation maps each sheet by headers. The pilot remains a requirements calculator, not a stock-availability dashboard; stock shortfalls cannot be calculated from this source.

The repository is public and currently tracks a copy of the workbook at its root. Public-data permission must be confirmed. Local browser-only workbook reading is the planned prototype boundary; shared publication, authentication, and hosting still require an approved internal design.

## Out of Scope

- Editing inventory counts or writing changes back to the source workbook.
- Comparing requirements with on-hand stock, showing shortages, or claiming materials are available; the workbook has no stock quantities.
- Calculating per-group quantities before group size and partial-group rounding are defined.
- Concurrent stock editing, user roles, or authentication implementation.
- External stakeholder access, SSO, or integration with purchasing and warehouse systems.
- Purchase orders, replenishment recommendations, or automated substitutions.
- Guessing quantity rules or filling missing source data with fabricated defaults.

## Assumptions and Validation Checkpoints

1. **The six grade-sheet activity and teacher-page material columns are the intended source view.** Validate each header mapping and the quantity semantics with the workbook owner before operational use.
2. **Only explicit per-student and per-class expressions are candidates for scaling.** Validate `1/student`, `1/class`, and unit-bearing variants with the owner; hand-check class sizes 1 and a representative larger class for each grade. Grade 1-2 group quantities, bare values, and all other forms remain uncalculated until rules are agreed.
3. **A local read-only prototype is useful before shared publishing is designed.** Validate the local workflow with the instructional designer, and separately confirm with IT that the workbook may remain in the public GitHub repository and identify an approved internal hosting/access model.