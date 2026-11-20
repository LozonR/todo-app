import Database from "better-sqlite3";
import type { Todo } from "./types.js";
import path from "node:path";
import { fileURLToPath } from "node:url";

type Row = {
  id: number;
  text: string;
  done: number;
}

const dbPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "todos.db");
const db = new Database(dbPath);
db.exec(`CREATE TABLE IF NOT EXISTS todos (
           id INTEGER PRIMARY KEY AUTOINCREMENT,
           text TEXT NOT NULL,
           done INTEGER NOT NULL DEFAULT 0 CHECK (done IN (0, 1))
         )`);

const selectStmt    = db.prepare("SELECT * FROM todos WHERE id = ?");
const selectAllStmt = db.prepare("SELECT * FROM todos ORDER BY id");
const insertStmt    = db.prepare("INSERT INTO todos (text) VALUES (?)");
const updateStmt    = db.prepare("UPDATE todos SET text = @text, done = @done WHERE id = @id");
const removeStmt    = db.prepare("DELETE FROM todos WHERE id = ?");

function rowToTodo(row: Row): Todo {
  return { id: row.id, text: row.text, done: row.done === 1 };
}

export function getAll(): Todo[] {
  const rows = selectAllStmt.all() as Row[];
  return rows.map(rowToTodo)
}

export function create(text: string): Todo {
  const info = insertStmt.run(text);
  return { id: Number(info.lastInsertRowid), text, done: false };
}

export function update(id: number, changes: { text?: string, done?: boolean }): Todo | undefined {
  const row = selectStmt.get(id) as Row | undefined;
  if (!row) {
    return undefined;
  }

  const newText = changes.text ?? row.text;
  const newDone = changes.done ?? (row.done === 1);

  updateStmt.run({ text: newText, done: newDone ? 1 : 0, id: id });

  return { id, text: newText, done: newDone };
}

export function remove(id: number): boolean {
  const info = removeStmt.run(id);
  return info.changes > 0;
}
