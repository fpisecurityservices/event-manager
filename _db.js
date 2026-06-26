import { neon } from '@neondatabase/serverless';

let _sql = null;

export function getDb() {
  if (!_sql) {
    _sql = neon(process.env.DATABASE_URL);
  }
  return _sql;
}

export async function initTables() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS meta (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS guards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      badge TEXT,
      post TEXT,
      shift TEXT,
      rate NUMERIC
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      guard_id TEXT,
      action TEXT,
      note TEXT,
      by_sup TEXT,
      ts BIGINT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      type TEXT,
      sender TEXT,
      text TEXT,
      ts BIGINT
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS notes (
      id TEXT PRIMARY KEY,
      guard_id TEXT,
      guard_name TEXT,
      text TEXT,
      by_sup TEXT,
      ts BIGINT
    )
  `;
}

export function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
  });
}

export function errorResponse(msg, status = 500) {
  return jsonResponse({ error: msg }, status);
}
