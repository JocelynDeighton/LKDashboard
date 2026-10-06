# Current Status

## Phase 4: Local Grades K-5 Pilot

The page reads an `.xlsx` file in the browser and supports `Grade K` through `Grade 5`. Each sheet maps activity, teacher-page material, nomenclature, and quantity fields from its own headers. Parsing is bounded to rows 1-250 per sheet. Formula cells, missing required columns or worksheets, unsupported files, and files larger than 20 MB produce recoverable errors.

The calculator accepts a positive whole-number class size. After the user affirms that the rules for the selected grade were verified with the workbook owner, explicit `n/student` and `n/class` quantities on sheets with a general `Qty.` column update automatically as the class size or activity changes, preserving a stated unit. Grades 1-2 use per-group quantity columns; those values are not calculated because group size and partial-group rounding are undefined. Blank quantities, bare numbers, unsupported formats, and records without a teacher-page material name remain unresolved.

## Workbook Check

The reviewed workbook loaded successfully in the browser. Grade entry counts were K: 97, Grade 1: 125, Grade 2: 159, Grade 3: 152, Grade 4: 209, and Grade 5: 193. Grade K had 23 entries without teacher-page material text and one source row without an activity title (row 99). For `One Potato, Two Potato`, a simulated class size of 30 produced 30 hand lenses for `1/student`, 1 pair of heat-resistant gloves for `1 pair/class`, and 1 hot plate for `1/class`. The bare quantities for sweet potato (`2`) and paper towel (`1`) remained unresolved.

Grade 1 and Grade 2 imported successfully and their per-group quantities remained unresolved. On Grade 3 (`The Shape of the States`), Grade 4 (`Mixed-Up Matter`), and Grade 5, `1/student` produced 30 safety goggles for a simulated class size of 30. Changing the class size from 30 to 31 immediately updated the Grade 5 result from 30 to 31 without pressing the calculate button. Grade 3 `1/class` and Grade 4 `1/class` examples each remained at 1. The browser check simulated the owner-confirmation checkbox to test calculation paths; this does not replace actual confirmation by the workbook owner. The source workbook was not modified.

## Limits and Verification

- Only rows 1-250 of each supported grade sheet are read; later rows are not parsed.
- Grade 1-2 group sizes and partial-group rounding rules are not defined, so per-group values cannot be scaled.
- The workbook has no on-hand stock values; availability, stock shortfalls, and inventory status are out of scope.
- Quantity semantics and expected values still require workbook-owner confirmation before operational use.
- SheetJS 0.20.3 is loaded from the official CDN. An internet connection is needed for the parser script; workbook bytes remain in the browser and are not sent to the CDN or an application server.
- Browser smoke checks covered all six grade imports and record counts, Grade 1-2 group handling, Grade K and Grade 5 calculations, unresolved quantities, confirmation gating, invalid class sizes, unsupported file recovery, and a 390-pixel viewport. VS Code reported no errors in the touched application files.

To repeat the check, open `index.html`, choose the reviewed `.xlsx` workbook, select `One Potato, Two Potato`, enter `30`, and check the owner-verification statement only after confirming the rules with the workbook owner.