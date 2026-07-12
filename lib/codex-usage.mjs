import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";

export function readCodexUsage(sessionId, codexHome = process.env.CODEX_HOME || path.join(os.homedir(), ".codex")) {
  const roots = [path.join(codexHome, "sessions"), path.join(codexHome, "archived_sessions")];
  for (const root of roots) {
    for (const filePath of jsonlFiles(root)) {
      const result = readCandidate(filePath, sessionId);
      if (result) return result;
    }
  }
  return null;
}

function readCandidate(filePath, requestedId) {
  const events = [];
  let matches = false;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    if (!line.trim()) continue;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      continue;
    }
    events.push(event);
    if (event.type === "session_meta") {
      const ids = [event.payload?.id, event.payload?.session_id].filter(Boolean);
      if (ids.includes(requestedId)) matches = true;
    }
  }
  if (!matches) return null;

  let model = null;
  let reasoningEffort = null;
  let provider = null;
  let tokenUsage = null;
  let startedAt = null;
  let completedAt = null;
  let durationMs = 0;
  for (const event of events) {
    if (event.type === "session_meta") provider = event.payload?.model_provider ?? provider;
    if (event.type === "turn_context") {
      model = event.payload?.model ?? model;
      reasoningEffort = event.payload?.effort ?? reasoningEffort;
    }
    if (event.type === "event_msg" && event.payload?.type === "task_started") {
      startedAt ??= event.payload.started_at ?? event.timestamp ?? null;
    }
    if (event.type === "event_msg" && event.payload?.type === "task_complete") {
      completedAt = event.payload.completed_at ?? event.timestamp ?? completedAt;
      if (Number.isFinite(event.payload.duration_ms)) durationMs += event.payload.duration_ms;
    }
    if (event.type === "event_msg" && event.payload?.type === "token_count" && event.payload.info?.total_token_usage) {
      tokenUsage = event.payload.info.total_token_usage;
    }
  }

  return {
    sessionId: requestedId,
    actualModel: model,
    reasoningEffort,
    provider,
    startedAt,
    completedAt,
    durationMs: durationMs || null,
    tokenUsage: {
      usageId: `codex-${crypto.createHash("sha256").update(requestedId).digest("hex").slice(0, 12)}`,
      source: tokenUsage ? "measured" : "unavailable",
      scope: "session",
      inputTokens: tokenUsage?.input_tokens ?? null,
      cachedInputTokens: tokenUsage?.cached_input_tokens ?? null,
      outputTokens: tokenUsage?.output_tokens ?? null,
      reasoningOutputTokens: tokenUsage?.reasoning_output_tokens ?? null,
      totalTokens: tokenUsage?.total_tokens ?? null
    }
  };
}

function jsonlFiles(root) {
  if (!fs.existsSync(root)) return [];
  const files = [];
  const visit = (directory) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) visit(entryPath);
      else if (entry.isFile() && entry.name.endsWith(".jsonl")) files.push(entryPath);
    }
  };
  visit(root);
  return files.sort().reverse();
}
