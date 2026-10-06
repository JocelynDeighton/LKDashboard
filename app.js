"use strict";

const MAX_FILE_BYTES = 20 * 1024 * 1024;
const MAX_SHEET_ROWS = 250;
const SUPPORTED_GRADES = ["Grade K", "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"];

const elements = {
  file: document.getElementById("workbook-file"),
  grade: document.getElementById("grade-select"),
  activity: document.getElementById("activity-select"),
  classSize: document.getElementById("class-size"),
  ownerConfirmation: document.getElementById("owner-confirmation"),
  form: document.getElementById("review-form"),
  calculateButton: document.getElementById("calculate-button"),
  calculationNote: document.getElementById("calculation-note"),
  importMessage: document.getElementById("import-message"),
  sourceWarning: document.getElementById("source-warning"),
  sourceHeading: document.getElementById("source-heading"),
  summaryFile: document.getElementById("summary-file"),
  summaryRecords: document.getElementById("summary-records"),
  resultsSummary: document.getElementById("results-summary"),
  resultsBody: document.getElementById("results-body")
};

const state = {
  workbook: null,
  workbookName: "",
  grade: "",
  quantityMode: "explicit",
  entries: [],
  activities: [],
  missingActivityRows: [],
  missingMaterialCount: 0,
  calculated: false
};

function cellText(value) {
  return value == null ? "" : String(value);
}

function hasText(value) {
  return cellText(value).trim() !== "";
}

function setImportMessage(message, kind = "info") {
  elements.importMessage.textContent = message;
  elements.importMessage.dataset.kind = kind;
}

function setSourceStatus(heading, fileSummary, recordSummary) {
  elements.sourceHeading.textContent = heading;
  elements.summaryFile.textContent = fileSummary;
  elements.summaryRecords.textContent = recordSummary;
}

function resetResults(message) {
  state.calculated = false;
  elements.resultsBody.replaceChildren();
  elements.resultsSummary.textContent = message;
}

function resetWorkflow() {
  state.workbook = null;
  state.workbookName = "";
  state.grade = "";
  state.quantityMode = "explicit";
  state.entries = [];
  state.activities = [];
  state.missingActivityRows = [];
  state.missingMaterialCount = 0;
  state.calculated = false;
  elements.grade.replaceChildren(new Option("Load a workbook first", ""));
  elements.grade.disabled = true;
  elements.activity.replaceChildren(new Option("Load a workbook first", ""));
  elements.activity.disabled = true;
  elements.classSize.value = "";
  elements.classSize.disabled = true;
  elements.classSize.setAttribute("aria-invalid", "false");
  elements.ownerConfirmation.checked = false;
  elements.ownerConfirmation.disabled = true;
  elements.calculateButton.disabled = true;
  elements.calculationNote.textContent = "Calculations remain locked until the quantity rules are verified.";
  elements.sourceWarning.replaceChildren();
  elements.sourceWarning.hidden = true;
  resetResults("Load a workbook to inspect its Grade K entries.");
}

function normalizeHeader(value) {
  return cellText(value).replace(/\s+/g, " ").trim().toLowerCase();
}

function findColumn(headers, matcher) {
  return headers.findIndex((header) => matcher(normalizeHeader(header)));
}

function parseGradeSheet(workbook, grade) {
  if (typeof XLSX === "undefined") {
    throw new Error("The spreadsheet reader did not load. Check your connection and try again.");
  }

  if (!workbook.Sheets || !workbook.Sheets[grade]) {
    throw new Error(`This workbook does not contain a worksheet named ${grade}.`);
  }

  const sheet = workbook.Sheets[grade];
  const formulaFound = Object.entries(sheet).some(([address, cell]) =>
    !address.startsWith("!") && cell && typeof cell === "object" && Boolean(cell.f)
  );
  if (formulaFound) {
    throw new Error(`${grade} contains formulas. This pilot accepts source values only.`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    raw: true,
    defval: "",
    blankrows: true
  });
  const headers = rows[0] || [];
  const columns = {
    activity: findColumn(headers, (header) => header.includes("activity title")),
    material: findColumn(headers, (header) => header.includes("listing on teacher page")),
    nomenclature: findColumn(headers, (header) => header.includes("list nomenclature")),
    quantity: findColumn(headers, (header) =>
      header === "qty." || header === "qty./group" || header === "quantity per group"
    )
  };
  const missingHeaders = Object.entries(columns)
    .filter(([, index]) => index < 0)
    .map(([name]) => name);

  if (missingHeaders.length > 0) {
    throw new Error(`${grade} is missing required columns: ${missingHeaders.join(", ")}.`);
  }
  const quantityHeader = normalizeHeader(headers[columns.quantity]);
  const quantityMode = quantityHeader.includes("group") ? "group" : "explicit";

  const sourceRows = rows.slice(1).map((row, index) => ({
    rowNumber: index + 2,
    values: row,
    activity: cellText(row[columns.activity]),
    material: cellText(row[columns.material]),
    nomenclature: cellText(row[columns.nomenclature]),
    quantity: cellText(row[columns.quantity])
  }));
  const entries = sourceRows.filter((row) => row.values.some(hasText));
  const missingActivityRows = sourceRows
    .filter((row) => row.values.some(hasText) && !hasText(row.activity))
    .map((row) => row.rowNumber);
  const activities = [...new Set(entries.map((row) => row.activity.trim()).filter(Boolean))];

  if (entries.length === 0 || activities.length === 0) {
    throw new Error(`No ${grade} material entries with activity titles were found in the first ${MAX_SHEET_ROWS} rows.`);
  }

  const missingMaterialCount = entries.filter((row) => !hasText(row.material)).length;

  return { grade, entries, activities, missingActivityRows, missingMaterialCount, quantityMode };
}

function parseQuantity(quantity) {
  const match = /^(\d+(?:\.\d+)?)\s*(.*?)\s*\/\s*(students?|class(?:es)?)$/i.exec(quantity.trim());
  if (!match) return null;

  return {
    amount: Number(match[1]),
    unit: match[2].trim(),
    basis: match[3].toLowerCase().startsWith("student") ? "student" : "class"
  };
}

function formatAmount(amount) {
  return new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 }).format(amount);
}

function quantityStatus(entry, parsedQuantity, hasCalculated) {
  if (!hasText(entry.material)) return { text: "Material name missing", kind: "unresolved" };
  if (!hasText(entry.quantity)) return { text: "Quantity missing", kind: "unresolved" };
  if (state.quantityMode === "group") return { text: "Needs group-size rule", kind: "unresolved" };
  if (!parsedQuantity) return { text: "Needs quantity rule", kind: "unresolved" };
  if (!elements.ownerConfirmation.checked) return { text: "Owner verification required", kind: "unresolved" };
  if (!hasCalculated) return { text: "Ready to calculate", kind: "pending" };
  return { text: "Calculated", kind: "calculated" };
}

function appendCell(row, text, className = "") {
  const cell = document.createElement("td");
  cell.textContent = text;
  if (className) cell.className = className;
  row.append(cell);
  return cell;
}

function renderMaterials() {
  const activity = elements.activity.value;
  const classSize = Number(elements.classSize.value);
  const selectedEntries = state.entries.filter((entry) => entry.activity.trim() === activity);
  const fragment = document.createDocumentFragment();

  for (const entry of selectedEntries) {
    const parsedQuantity = parseQuantity(entry.quantity);
    const row = document.createElement("tr");
    const status = quantityStatus(entry, parsedQuantity, state.calculated);
    appendCell(row, hasText(entry.material) ? entry.material : "Not listed in teacher-page material column");
    appendCell(row, hasText(entry.nomenclature) ? entry.nomenclature : "Not listed");
    appendCell(row, hasText(entry.quantity) ? entry.quantity : "Blank in source");
    appendCell(row, status.text, "status-cell").dataset.kind = status.kind;

    let classRequirement = "Not calculated";
    if (state.calculated && state.quantityMode === "explicit" && parsedQuantity && hasText(entry.material)) {
      const amount = parsedQuantity.basis === "student"
        ? parsedQuantity.amount * classSize
        : parsedQuantity.amount;
      classRequirement = `${formatAmount(amount)}${parsedQuantity.unit ? ` ${parsedQuantity.unit}` : ""}`;
    }
    appendCell(row, classRequirement);
    fragment.append(row);
  }

  elements.resultsBody.replaceChildren(fragment);
  elements.resultsSummary.textContent = `${selectedEntries.length} source ${selectedEntries.length === 1 ? "entry" : "entries"} for ${activity}.`;
}

function renderWarnings(result) {
  const warnings = [
    `The parser inspected ${result.grade} worksheet rows 1-${MAX_SHEET_ROWS}; later rows are not included.`,
    `${result.missingMaterialCount} ${result.grade} ${result.missingMaterialCount === 1 ? "entry has" : "entries have"} no teacher-page material text. These entries remain visible as unresolved.`
  ];

  if (result.missingActivityRows.length > 0) {
    warnings.push(`${result.missingActivityRows.length} source ${result.missingActivityRows.length === 1 ? "row has" : "rows have"} no activity title and cannot be assigned: ${result.missingActivityRows.join(", " )}.`);
  }

  elements.sourceWarning.replaceChildren(...warnings.map((message) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = message;
    return paragraph;
  }));
  elements.sourceWarning.hidden = false;
}

function hasValidClassSize() {
  const classSize = Number(elements.classSize.value);
  return Number.isSafeInteger(classSize) && classSize > 0 && elements.classSize.value.trim() !== "";
}

function canCalculate() {
  return state.quantityMode === "explicit" && state.entries.length > 0 && Boolean(elements.activity.value) &&
    hasValidClassSize() && elements.ownerConfirmation.checked;
}

function updateCalculateButton() {
  const validClassSize = hasValidClassSize();
  elements.classSize.setAttribute("aria-invalid", String(elements.classSize.value !== "" && !validClassSize));
  elements.calculateButton.disabled = !canCalculate();

  if (state.quantityMode === "group") {
    elements.ownerConfirmation.disabled = true;
    elements.calculationNote.textContent = "This sheet lists quantities per group. Group size and partial-group rounding are not defined, so these quantities remain unresolved.";
  } else if (!elements.ownerConfirmation.checked) {
    elements.ownerConfirmation.disabled = state.entries.length === 0;
    elements.calculationNote.textContent = "Calculations remain locked until the quantity rules are verified.";
  } else if (!validClassSize) {
    elements.ownerConfirmation.disabled = false;
    elements.calculationNote.textContent = "Enter a positive whole-number class size to calculate.";
  } else {
    elements.ownerConfirmation.disabled = false;
    elements.calculationNote.textContent = "Supported per-student and per-class quantities update automatically after owner confirmation and a valid class size.";
  }
}

function updateCalculation() {
  state.calculated = canCalculate();
  renderMaterials();
  updateCalculateButton();
}

function loadGrade(grade) {
  const result = parseGradeSheet(state.workbook, grade);
  state.grade = result.grade;
  state.entries = result.entries;
  state.activities = result.activities;
  state.missingActivityRows = result.missingActivityRows;
  state.missingMaterialCount = result.missingMaterialCount;
  state.quantityMode = result.quantityMode;
  state.calculated = false;

  elements.activity.replaceChildren(new Option("Select an activity", ""));
  for (const activity of state.activities) {
    elements.activity.add(new Option(activity, activity));
  }
  elements.activity.disabled = false;
  elements.activity.value = state.activities[0];
  elements.classSize.value = "";
  elements.classSize.disabled = false;
  elements.ownerConfirmation.checked = false;
  elements.ownerConfirmation.disabled = result.quantityMode === "group";
  elements.summaryRecords.textContent = String(state.entries.length);
  setSourceStatus(`${grade} worksheet ready`, state.workbookName, String(state.entries.length));
  setImportMessage(`Loaded ${state.entries.length} ${grade} source entries from ${state.workbookName}. The workbook was not uploaded.`);
  renderWarnings(result);
  renderMaterials();
  updateCalculateButton();
}

function clearGradeView(grade, error) {
  state.grade = grade;
  state.entries = [];
  state.activities = [];
  state.missingActivityRows = [];
  state.missingMaterialCount = 0;
  state.calculated = false;
  elements.activity.replaceChildren(new Option("Grade could not be loaded", ""));
  elements.activity.disabled = true;
  elements.classSize.value = "";
  elements.classSize.disabled = true;
  elements.ownerConfirmation.checked = false;
  elements.ownerConfirmation.disabled = true;
  elements.summaryRecords.textContent = "Not loaded";
  setSourceStatus(`${grade} worksheet could not be loaded`, state.workbookName, "Not loaded");
  elements.sourceWarning.replaceChildren();
  elements.sourceWarning.hidden = true;
  resetResults(`The ${grade} worksheet could not be displayed.`);
  setImportMessage(error instanceof Error ? error.message : `The ${grade} worksheet could not be read.`, "error");
  updateCalculateButton();
}

async function loadWorkbook(file) {
  resetWorkflow();
  if (!file) return;

  setSourceStatus("Reading workbook locally", file.name, "Loading");
  setImportMessage("Reading the Grade K-5 worksheets in this browser.");

  try {
    if (!file.name.toLowerCase().endsWith(".xlsx")) {
      throw new Error("Choose an .xlsx workbook for this pilot.");
    }
    if (file.size > MAX_FILE_BYTES) {
      throw new Error("This workbook exceeds the 20 MB limit for the local pilot.");
    }
    if (typeof XLSX === "undefined") {
      throw new Error("The spreadsheet reader did not load. Check your connection and try again.");
    }

    const workbook = XLSX.read(await file.arrayBuffer(), {
      type: "array",
      sheetRows: MAX_SHEET_ROWS,
      cellFormula: true
    });
    const missingGrades = SUPPORTED_GRADES.filter((grade) => !workbook.Sheets[grade]);
    if (missingGrades.length > 0) {
      throw new Error(`This workbook is missing supported worksheets: ${missingGrades.join(", ")}.`);
    }
    state.workbook = workbook;
    state.workbookName = file.name;

    elements.grade.replaceChildren();
    for (const grade of SUPPORTED_GRADES) {
      elements.grade.add(new Option(grade, grade));
    }
    elements.grade.disabled = false;
    elements.grade.value = SUPPORTED_GRADES[0];
    elements.summaryFile.textContent = file.name;
    loadGrade(SUPPORTED_GRADES[0]);
  } catch (error) {
    resetWorkflow();
    elements.file.value = "";
    setSourceStatus("Workbook could not be loaded", "Not loaded", "Not loaded");
    setImportMessage(error instanceof Error ? error.message : "The workbook could not be read.", "error");
  }
}

elements.file.addEventListener("change", (event) => {
  loadWorkbook(event.currentTarget.files[0]);
});

elements.grade.addEventListener("change", () => {
  try {
    loadGrade(elements.grade.value);
  } catch (error) {
    clearGradeView(elements.grade.value, error);
  }
});

elements.activity.addEventListener("change", () => {
  updateCalculation();
});

elements.classSize.addEventListener("input", () => {
  updateCalculation();
});

elements.ownerConfirmation.addEventListener("change", () => {
  updateCalculation();
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  updateCalculateButton();
  if (elements.calculateButton.disabled) return;

  state.calculated = true;
  renderMaterials();
});