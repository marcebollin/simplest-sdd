import fs from "node:fs";
import path from "node:path";

const categories = new Set([
  "feature", "bug", "security", "performance", "tests", "tech-debt",
  "migration", "dx", "docs", "research", "design"
]);
const efforts = new Set(["S", "M", "L", "XL"]);
const confidences = new Set(["low", "medium", "high"]);
const risks = new Set(["low", "medium", "high"]);
const profiles = new Set(["strong-planner", "strong-worker", "efficient-worker", "strong-reviewer", "efficient-reviewer"]);
const strategyModes = new Set(["same-session", "delegated", "hybrid", "custom"]);
const assignmentModes = new Set(["same-session", "delegated"]);
const roles = new Set(["planner", "orchestrator", "executor", "verifier", "reviewer"]);
const outcomes = new Set(["complete", "stopped", "blocked", "failed"]);
const tokenSources = new Set(["measured", "reported", "estimated", "unavailable"]);
const tokenScopes = new Set(["task", "run", "session"]);

export function loadExecutionRecords(cwd) {
  const specsRoot = path.join(cwd, ".agents", "skills", "spec-library", "specs");
  const files = findNamedFiles(specsRoot, "execution.json");
  const records = [];
  const errors = [];

  for (const filePath of files) {
    let record;
    try {
      record = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (error) {
      errors.push(`${relative(cwd, filePath)}: invalid JSON (${error.message})`);
      continue;
    }

    const recordErrors = validateExecutionRecord(record);
    if (recordErrors.length > 0) {
      for (const error of recordErrors) {
        errors.push(`${relative(cwd, filePath)}: ${error}`);
      }
      continue;
    }

    records.push({ filePath, record });
  }

  records.sort((left, right) => left.record.specId.localeCompare(right.record.specId));
  return { specsRoot, files, records, errors };
}

export function validateExecutionRecord(record) {
  const errors = [];
  if (!isObject(record)) return ["root must be an object"];

  requiredString(record, "schemaVersion", errors);
  if (record.schemaVersion !== "1.0.0") errors.push("schemaVersion must be 1.0.0");
  requiredString(record, "specId", errors);
  if (typeof record.specId === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(record.specId)) {
    errors.push("specId must be a lowercase kebab-case identifier");
  }
  requiredString(record, "title", errors);

  if (!isObject(record.classification)) {
    errors.push("classification must be an object");
  } else {
    enumValue(record.classification.primaryCategory, categories, "classification.primaryCategory", errors);
    enumValue(record.classification.overallEffort, efforts, "classification.overallEffort", errors);
    enumValue(record.classification.planConfidence, confidences, "classification.planConfidence", errors);
    enumValue(record.classification.delegationConfidence, confidences, "classification.delegationConfidence", errors);
    if (!Array.isArray(record.classification.tags)) {
      errors.push("classification.tags must be an array");
    } else {
      record.classification.tags.forEach((tag, index) => enumValue(tag, categories, `classification.tags[${index}]`, errors));
    }
  }

  if (!isObject(record.planning)) {
    errors.push("planning must be an object");
  } else {
    requiredString(record.planning, "plannedAt", errors, "planning.");
    enumValue(record.planning.capabilityProfile, profiles, "planning.capabilityProfile", errors);
    nullableString(record.planning.plannedAtCommit, "planning.plannedAtCommit", errors);
    nullableString(record.planning.actualModel, "planning.actualModel", errors);
    nullableString(record.planning.reasoningEffort, "planning.reasoningEffort", errors);
  }

  validateStrategy(record.strategy, errors);
  validateTasks(record.tasks, errors);
  validateRuns(record.runs, record.tasks, errors);
  return errors;
}

export function analyticsRows(entries) {
  const rows = [];
  for (const { record } of entries) {
    if (record.runs.length === 0) {
      rows.push(rowFor(record, null));
      continue;
    }
    for (const run of record.runs) rows.push(rowFor(record, run));
  }
  return rows;
}

export function formatAnalytics(entries, format) {
  const rows = analyticsRows(entries);
  if (format === "jsonl") return rows.map((row) => JSON.stringify(row)).join("\n");
  if (format === "csv") return formatCsv(rows);
  if (format === "json") return JSON.stringify(rows, null, 2);
  return formatSummary(entries);
}

function validateStrategy(strategy, errors) {
  if (!isObject(strategy)) {
    errors.push("strategy must be an object");
    return;
  }
  if (!isObject(strategy.recommended)) {
    errors.push("strategy.recommended must be an object");
  } else {
    enumValue(strategy.recommended.mode, strategyModes, "strategy.recommended.mode", errors);
    requiredString(strategy.recommended, "rationale", errors, "strategy.recommended.");
  }
  if (!Array.isArray(strategy.optionsPresented) || !strategy.optionsPresented.includes("same-session")) {
    errors.push("strategy.optionsPresented must be an array containing same-session");
  } else {
    strategy.optionsPresented.forEach((mode, index) => enumValue(mode, strategyModes, `strategy.optionsPresented[${index}]`, errors));
  }
  if (strategy.selected !== null && strategy.selected !== undefined) {
    if (!isObject(strategy.selected)) {
      errors.push("strategy.selected must be null or an object");
    } else {
      enumValue(strategy.selected.mode, strategyModes, "strategy.selected.mode", errors);
      if (strategy.selected.selectedBy !== "user") errors.push("strategy.selected.selectedBy must be user");
      requiredString(strategy.selected, "selectedAt", errors, "strategy.selected.");
    }
  }
}

function validateTasks(tasks, errors) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    errors.push("tasks must be a non-empty array");
    return;
  }
  const ids = new Set();
  tasks.forEach((task, index) => {
    const prefix = `tasks[${index}]`;
    if (!isObject(task)) {
      errors.push(`${prefix} must be an object`);
      return;
    }
    if (typeof task.id !== "string" || !/^T[1-9][0-9]*$/.test(task.id)) errors.push(`${prefix}.id must match T<number>`);
    else if (ids.has(task.id)) errors.push(`${prefix}.id is duplicated`);
    else ids.add(task.id);
    requiredString(task, "title", errors, `${prefix}.`);
    enumValue(task.category, categories, `${prefix}.category`, errors);
    enumValue(task.effort, efforts, `${prefix}.effort`, errors);
    enumValue(task.risk, risks, `${prefix}.risk`, errors);
    enumValue(task.planConfidence, confidences, `${prefix}.planConfidence`, errors);
    enumValue(task.delegationConfidence, confidences, `${prefix}.delegationConfidence`, errors);
    if (!Array.isArray(task.dependsOn)) errors.push(`${prefix}.dependsOn must be an array`);
    if (typeof task.parallelizable !== "boolean") errors.push(`${prefix}.parallelizable must be boolean`);
    if (!isObject(task.scope) || !Array.isArray(task.scope.in) || task.scope.in.length === 0 || !Array.isArray(task.scope.out)) {
      errors.push(`${prefix}.scope must contain non-empty in and array out lists`);
    }
    if (!Array.isArray(task.verification) || task.verification.length === 0) errors.push(`${prefix}.verification must be non-empty`);
    else task.verification.forEach((gate, gateIndex) => {
      if (!isObject(gate) || typeof gate.command !== "string" || typeof gate.expected !== "string") {
        errors.push(`${prefix}.verification[${gateIndex}] must contain command and expected strings`);
      }
    });
    if (!Array.isArray(task.stopConditions) || task.stopConditions.length === 0) errors.push(`${prefix}.stopConditions must be non-empty`);
    validateAssignment(task.recommendedExecution, `${prefix}.recommendedExecution`, errors);
    if (task.selectedExecution !== null) validateAssignment(task.selectedExecution, `${prefix}.selectedExecution`, errors);
  });
  tasks.forEach((task, index) => {
    if (!Array.isArray(task?.dependsOn)) return;
    for (const dependency of task.dependsOn) {
      if (!ids.has(dependency)) errors.push(`tasks[${index}].dependsOn references unknown task ${dependency}`);
    }
  });
}

function validateRuns(runs, tasks, errors) {
  if (!Array.isArray(runs)) {
    errors.push("runs must be an array");
    return;
  }
  const taskIds = new Set(Array.isArray(tasks) ? tasks.map((task) => task?.id).filter(Boolean) : []);
  const runIds = new Set();
  const usageIds = new Set();
  runs.forEach((run, index) => {
    const prefix = `runs[${index}]`;
    if (!isObject(run)) {
      errors.push(`${prefix} must be an object`);
      return;
    }
    requiredString(run, "id", errors, `${prefix}.`);
    if (runIds.has(run.id)) errors.push(`${prefix}.id is duplicated`);
    else runIds.add(run.id);
    enumValue(run.role, roles, `${prefix}.role`, errors);
    enumValue(run.executionMode, assignmentModes, `${prefix}.executionMode`, errors);
    enumValue(run.capabilityProfile, profiles, `${prefix}.capabilityProfile`, errors);
    nullableString(run.actualModel, `${prefix}.actualModel`, errors);
    if (!Array.isArray(run.taskIds)) errors.push(`${prefix}.taskIds must be an array`);
    else run.taskIds.forEach((taskId) => {
      if (!taskIds.has(taskId)) errors.push(`${prefix}.taskIds references unknown task ${taskId}`);
    });
    enumValue(run.outcome, outcomes, `${prefix}.outcome`, errors);
    if (!Number.isInteger(run.revisionCount) || run.revisionCount < 0) errors.push(`${prefix}.revisionCount must be a non-negative integer`);
    if (!isObject(run.tokenUsage)) errors.push(`${prefix}.tokenUsage must be an object`);
    else {
      enumValue(run.tokenUsage.source, tokenSources, `${prefix}.tokenUsage.source`, errors);
      enumValue(run.tokenUsage.scope, tokenScopes, `${prefix}.tokenUsage.scope`, errors);
      nullableString(run.tokenUsage.usageId, `${prefix}.tokenUsage.usageId`, errors);
      if (run.tokenUsage.usageId && usageIds.has(run.tokenUsage.usageId)) errors.push(`${prefix}.tokenUsage.usageId is duplicated and would double-count usage`);
      else if (run.tokenUsage.usageId) usageIds.add(run.tokenUsage.usageId);
      for (const field of ["inputTokens", "cachedInputTokens", "outputTokens", "reasoningOutputTokens", "totalTokens"]) {
        const value = run.tokenUsage[field];
        if (value !== null && (!Number.isInteger(value) || value < 0)) errors.push(`${prefix}.tokenUsage.${field} must be null or a non-negative integer`);
      }
    }
  });
}

function validateAssignment(assignment, label, errors) {
  if (!isObject(assignment)) {
    errors.push(`${label} must be an object`);
    return;
  }
  enumValue(assignment.mode, assignmentModes, `${label}.mode`, errors);
  enumValue(assignment.capabilityProfile, profiles, `${label}.capabilityProfile`, errors);
  if (!new Set(["low", "medium", "high"]).has(assignment.reasoningEffort)) errors.push(`${label}.reasoningEffort is invalid`);
  requiredString(assignment, "rationale", errors, `${label}.`);
}

function rowFor(record, run) {
  const selected = record.strategy.selected;
  return {
    specId: record.specId,
    title: record.title,
    primaryCategory: record.classification.primaryCategory,
    tags: record.classification.tags.join("|"),
    overallEffort: record.classification.overallEffort,
    planConfidence: record.classification.planConfidence,
    delegationConfidence: record.classification.delegationConfidence,
    recommendedStrategy: record.strategy.recommended.mode,
    selectedStrategy: selected?.mode ?? null,
    strategyOverridden: Boolean(selected && selected.mode !== record.strategy.recommended.mode),
    runId: run?.id ?? null,
    role: run?.role ?? null,
    taskIds: run?.taskIds?.join("|") ?? "",
    executionMode: run?.executionMode ?? null,
    capabilityProfile: run?.capabilityProfile ?? null,
    actualModel: run?.actualModel ?? null,
    reasoningEffort: run?.reasoningEffort ?? null,
    durationMs: run?.durationMs ?? null,
    usageId: run?.tokenUsage?.usageId ?? null,
    inputTokens: run?.tokenUsage?.inputTokens ?? null,
    cachedInputTokens: run?.tokenUsage?.cachedInputTokens ?? null,
    outputTokens: run?.tokenUsage?.outputTokens ?? null,
    reasoningOutputTokens: run?.tokenUsage?.reasoningOutputTokens ?? null,
    totalTokens: run?.tokenUsage?.totalTokens ?? null,
    tokenSource: run?.tokenUsage?.source ?? null,
    tokenScope: run?.tokenUsage?.scope ?? null,
    outcome: run?.outcome ?? null,
    revisionCount: run?.revisionCount ?? null,
    completedAt: run?.completedAt ?? null
  };
}

function formatSummary(entries) {
  const headers = ["SPEC", "CATEGORY", "EFFORT", "PLAN CONF", "DELEG CONF", "STRATEGY", "RUNS", "TOKENS", "OUTCOME"];
  const rows = [];
  for (const { record } of entries) {
    const seenUsage = new Set();
    const tokens = record.runs.reduce((sum, run, index) => {
      const usageId = run.tokenUsage?.usageId ?? `unidentified-${index}`;
      if (seenUsage.has(usageId)) return sum;
      seenUsage.add(usageId);
      return sum + (run.tokenUsage?.totalTokens ?? 0);
    }, 0);
    const outcomes = [...new Set(record.runs.map((run) => run.outcome))].join("|") || "not-run";
    rows.push([
      record.specId,
      record.classification.primaryCategory,
      record.classification.overallEffort,
      record.classification.planConfidence,
      record.classification.delegationConfidence,
      record.strategy.selected?.mode ?? "unselected",
      record.runs.length,
      tokens || "—",
      outcomes
    ]);
  }

  const widths = headers.map((header, index) => Math.max(
    header.length,
    ...rows.map((row) => String(row[index]).length)
  ));
  const formatRow = (row) => row.map((cell, index) => {
    const value = String(cell);
    return index === row.length - 1 ? value : value.padEnd(widths[index] + 2);
  }).join("");

  return ["Spec execution summary", "", formatRow(headers), ...rows.map(formatRow)].join("\n");
}

function formatCsv(rows) {
  if (rows.length === 0) return "";
  const headers = Object.keys(rows[0]);
  const lines = [headers.map(csvCell).join(",")];
  for (const row of rows) lines.push(headers.map((header) => csvCell(row[header])).join(","));
  return lines.join("\n");
}

function csvCell(value) {
  if (value === null || value === undefined) return "";
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
}

function findNamedFiles(root, name) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(entryPath);
      else if (entry.isFile() && entry.name === name) files.push(entryPath);
    }
  };
  visit(root);
  return files.sort();
}

function isObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function requiredString(object, key, errors, prefix = "") {
  if (typeof object?.[key] !== "string" || object[key].length === 0) errors.push(`${prefix}${key} must be a non-empty string`);
}

function nullableString(value, label, errors) {
  if (value !== null && typeof value !== "string") errors.push(`${label} must be a string or null`);
}

function enumValue(value, allowed, label, errors) {
  if (!allowed.has(value)) errors.push(`${label} has invalid value ${JSON.stringify(value)}`);
}

function relative(cwd, filePath) {
  return path.relative(cwd, filePath) || ".";
}
