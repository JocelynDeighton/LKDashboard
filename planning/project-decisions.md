# Project Decisions

## Confirmed Direction

- **Project:** Labs & Kits Dashboard for K-12 curriculum materials.
- **Primary user:** Instructional designer; internal stakeholders are the first audience, with external access deferred.
- **Preferred stack:** Static Vanilla HTML/CSS/JavaScript unless workbook parsing or approved shared publishing requires an additional component.
- **Source of truth:** The owner-approved materials workbook; the application must not silently replace missing values with examples or zeros.
- **Data ownership:** One designated owner publishes the canonical dataset; stakeholders view the published data. The publishing and hosting mechanism has not been chosen.
- **Workbook facts:** Nine worksheets, no spreadsheet formulas, and no on-hand stock field. Grade-specific layouts and quantity columns differ.
- **Current first slice:** Local, read-only Grade K-5 activity selection and class-size calculation for explicitly verified per-student and per-class expressions. Grade 1-2 per-group and other unsupported quantities remain visibly unresolved.
- **Stock comparison:** Deferred; available-stock values are absent from the workbook.
- **Current prototype:** A local workbook reader maps all six grade sheets by headers; workbook-owner validation and approved publishing remain open.

## Open Decisions

- Do the activity, teacher-page material, nomenclature, and quantity header mappings represent the correct source fields for all six grade sheets?
- What do bare quantity values (such as `1` or `2`), ranges, approximate quantities, and per-group values mean? What group-size and rounding rules apply?
- What approved internal hosting and access-control option supports owner publication and stakeholder read access?
- Is the workbook approved for public access? It is currently tracked at the root of a public GitHub repository.
- After the local proof, should the owner publish a normalized static dataset or use an approved backend?

## Guardrails

- Do not commit the source workbook or sensitive exports by default.
- The workbook is already present in the public remote's Git history; removing the working copy alone would not remove it from history.
- Do not run workbook macros or trust formulas/values until their meaning is reviewed.
- Keep the first implementation read-only with respect to source inventory.
- Record unresolved behavior as an explicit limitation rather than guessing.