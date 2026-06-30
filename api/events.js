import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  try {
    await initTables();
    const sql = getDb();
    const url = new URL(req.url);

    if (req.method === 'GET') {
      const supId = url.searchParams.get('supervisor_id');
      let rows;
      if (supId) {
        rows = await sql`
          SELECT e.* FROM events e
          JOIN guards g ON g.id = e.guard_id
          WHERE g.supervisor_id = ${supId}
          ORDER BY e.ts DESC
        `;
      } else {
        rows = await sql`SELECT * FROM events ORDER BY ts DESC`;
      }
      return jsonResponse(rows);
    }

    if (req.method === 'POST') {
      const { guardId, action, note, by, ts } = await req.json();
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO events (id, guard_id, action, note, by_sup, ts)
        VALUES (${id}, ${guardId}, ${action}, ${note||''}, ${by}, ${ts})
      `;
      return jsonResponse({ ok: true, id });
    }

    return errorResponse('Method not allowed', 405);
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
