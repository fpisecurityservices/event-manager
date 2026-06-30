import { neon } from '@neondatabase/serverless';

let _sql = null;
export function getDb() {
  if (!_sql) _sql = neon(process.env.DATABASE_URL);
  return _sql;
}

export async function initTables() {
  const sql = getDb();
  await sql`CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`;
  await sql`
    CREATE TABLE IF NOT EXISTS supervisors (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL
    )
  `;
  await sql`
    CREATE TABLE IF NOT EXISTS guards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      badge TEXT,
      phone TEXT,
      post TEXT,
      shift TEXT,
      rate NUMERIC,
      notes TEXT,
      employment_type TEXT,
      supervisor_id TEXT
    )
  `;
  await sql`ALTER TABLE guards ADD COLUMN IF NOT EXISTS phone TEXT`;
  await sql`ALTER TABLE guards ADD COLUMN IF NOT EXISTS notes TEXT`;
  await sql`ALTER TABLE guards ADD COLUMN IF NOT EXISTS employment_type TEXT`;
  await sql`ALTER TABLE guards ADD COLUMN IF NOT EXISTS supervisor_id TEXT`;
  // Dedup before creating unique index (safe to run repeatedly)
  await sql`
    DELETE FROM guards WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY name, supervisor_id ORDER BY id) AS rn
        FROM guards
      ) t WHERE rn > 1
    )
  `;
  await sql`CREATE UNIQUE INDEX IF NOT EXISTS guards_name_sup_uidx ON guards(name, supervisor_id)`;
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
    CREATE TABLE IF NOT EXISTS notes_log (
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
