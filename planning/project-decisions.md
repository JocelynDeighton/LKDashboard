# Project Decisions

## Confirmed Direction

- **Project:** Labs & Kits Dashboard for K-12 curriculum materials.
- **Primary user:** Instructional designer; internal stakeholders are the first audience, with external access deferred.
- **Preferred stack:** Static Vanilla HTML/CSS/JavaScript unless workbook parsing or approved shared publishing requires an additional component.
- **Source of truth:** The owner-approved materials workbook; the application must not silently replace missing values with examples or zeros.
- **Data ownership:** One designated owner publishes the canonical dataset; stakeholders view the published data. The publishing and hosting mechanism has not been chosen.
- **Intended first workflow:** Select a lab/kit and class size, calculate verified material requirements, and compare with on-hand stock when compatible stock data exists.
- **Current baseline:** A static entry page communicates that source data and quantity rules are not yet verified.

## Open Decisions

- Which workbook sheets and columns define labs/kits, material identity, required quantity, units, and on-hand stock?
- Are quantity rules per student, per team, fixed per class, mixed, or encoded in formulas? How should fractional quantities and rounding work?
- Does the workbook represent one shared stock pool or location-specific availability?
- What approved internal hosting and access-control option supports owner publication and stakeholder read access?
- Should the source workbook be parsed in the browser, transformed into a reviewed data file, or handled by an approved backend?

## Guardrails

- Do not commit the source workbook or sensitive exports by default.
- Do not run workbook macros or trust formulas/values until their meaning is reviewed.
- Keep the first implementation read-only with respect to source inventory.
- Record unresolved behavior as an explicit limitation rather than guessing.