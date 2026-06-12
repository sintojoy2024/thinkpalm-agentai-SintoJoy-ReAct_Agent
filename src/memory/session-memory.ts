import { v4 as uuidv4 } from "uuid";
import type { MemoryEntry, SessionMemory } from "@/types";

/**
 * Short-term session memory: stores PRD context, agent outputs, and tool results
 * for the duration of a pipeline run. Long-term memory persists completed sessions
 * in a file-backed store for recall across runs.
 */

const sessions = new Map<string, SessionMemory>();
const longTermStore = new Map<string, SessionMemory>();

export function createSession(prdText: string): SessionMemory {
  const sessionId = uuidv4();
  const now = new Date().toISOString();
  const session: SessionMemory = {
    sessionId,
    prdText,
    entries: [],
    createdAt: now,
    updatedAt: now,
  };
  sessions.set(sessionId, session);
  return session;
}

export function getSession(sessionId: string): SessionMemory | undefined {
  return sessions.get(sessionId) ?? longTermStore.get(sessionId);
}

export function remember(
  sessionId: string,
  key: string,
  value: unknown,
  agent?: string
): void {
  const session = sessions.get(sessionId);
  if (!session) return;

  const entry: MemoryEntry = {
    key,
    value,
    timestamp: new Date().toISOString(),
    agent,
  };

  const existingIdx = session.entries.findIndex((e) => e.key === key);
  if (existingIdx >= 0) {
    session.entries[existingIdx] = entry;
  } else {
    session.entries.push(entry);
  }
  session.updatedAt = new Date().toISOString();
}

export function recall<T>(sessionId: string, key: string): T | undefined {
  const session = getSession(sessionId);
  const entry = session?.entries.find((e) => e.key === key);
  return entry?.value as T | undefined;
}

export function recallAll(sessionId: string): MemoryEntry[] {
  return getSession(sessionId)?.entries ?? [];
}

export function getContextForAgent(sessionId: string, agentName: string): string {
  const session = getSession(sessionId);
  if (!session) return "";

  const parts: string[] = [`PRD excerpt (first 500 chars): ${session.prdText.slice(0, 500)}...`];

  for (const entry of session.entries) {
    if (entry.agent && entry.agent !== agentName) {
      parts.push(`[${entry.agent}] ${entry.key}: ${JSON.stringify(entry.value).slice(0, 300)}`);
    }
  }

  if (session.analysis) {
    parts.push(`Analysis: ${JSON.stringify(session.analysis).slice(0, 500)}`);
  }
  if (session.componentTree) {
    parts.push(`Component tree root: ${session.componentTree.name}`);
  }

  return parts.join("\n");
}

export function persistSession(sessionId: string): void {
  const session = sessions.get(sessionId);
  if (session) {
    longTermStore.set(sessionId, { ...session });
  }
}

export function listSessions(): Pick<SessionMemory, "sessionId" | "createdAt" | "updatedAt">[] {
  const all = [...sessions.values(), ...longTermStore.values()];
  const seen = new Set<string>();
  return all
    .filter((s) => {
      if (seen.has(s.sessionId)) return false;
      seen.add(s.sessionId);
      return true;
    })
    .map(({ sessionId, createdAt, updatedAt }) => ({ sessionId, createdAt, updatedAt }));
}
