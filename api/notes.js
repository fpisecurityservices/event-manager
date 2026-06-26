import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  try {
    await initTables();
    const sql = getDb();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM notes ORDER BY ts DESC`;
      return jsonResponse(rows);
    }

    if (req.method === 'POST') {
      const { guardId, guardName, text, by, ts } = await req.json();
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO notes (id, guard_id, guard_name, text, by_sup, ts)
        VALUES (${id}, ${guardId || null}, ${guardName || 'General'}, ${text}, ${by}, ${ts})
      `;
      return jsonResponse({ ok: true, id });
    }

    return errorResponse('Method not allowed', 405);
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
