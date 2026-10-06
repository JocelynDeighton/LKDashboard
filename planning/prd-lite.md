# PRD-lite: Labs & Kits Dashboard

## Problem Statement

Instructional designers and K-12 curriculum stakeholders need a trustworthy view of lab and kit materials so they can determine what a class needs and whether available stock is sufficient.

## Primary Target User and Outcome

The primary user is an instructional designer planning K-12 lab and kit curricula. Internal stakeholders need to review the same source of truth. For a selected lab or kit and class size, the intended outcome is a clear list of required materials and any stock shortfalls, based only on verified source data and rules.

## In-Scope First Slice

- Use one owner-approved materials workbook as the source for the first supported dataset.
- Select one lab or kit and enter a class size.
- Calculate material requirements using rules verified against the workbook and its owner.
- Compare required amounts with on-hand quantities only when the workbook provides compatible stock and unit data.
- Clearly report missing, ambiguous, or malformed inputs instead of inventing values.

Workbook import mechanics, hosting, and shared publication are not yet specified. The attached workbook has not been inspectable in the workspace, so workbook fields, formula semantics, units, and rounding behavior remain unconfirmed. This first slice must be narrowed or revised if source review shows the workflow cannot be supported safely.

## Out of Scope

- Editing inventory counts or writing changes back to the source workbook.
- Concurrent stock editing, user roles, or authentication implementation.
- External stakeholder access, SSO, or integration with purchasing and warehouse systems.
- Purchase orders, replenishment recommendations, or automated substitutions.
- Guessing quantity rules or filling missing source data with fabricated defaults.

## Assumptions and Validation Checkpoints

1. **The workbook contains identifiable records that can be related to a lab/kit, materials, quantities, and units.** Validate by reviewing its sheets, headers, identifiers, and representative rows with the owner. The workbook is not currently accessible for this review.
2. **Required amounts can be derived deterministically from class size and documented material rules.** Validate by tracing the workbook formulas/rules and hand-checking at least one ordinary and one boundary class-size example with the owner, including team-size and rounding behavior if applicable.
3. **One designated owner can publish a canonical dataset for internal stakeholders using an approved hosting and access model.** Validate with the owner and IT before choosing persistence, permissions, and deployment; the hosting mechanism remains undecided.