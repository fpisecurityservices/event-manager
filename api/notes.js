import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,DELETE', 'Access-Control-Allow-Headers': 'Content-Type' } });
  try {
    await initTables();
    const sql = getDb();
    const url = new URL(req.url);

    if (req.method === 'GET') {
      const supId = url.searchParams.get('supervisor_id');
      let rows;
      if (supId) {
        rows = await sql`
          SELECT n.* FROM notes_log n
          LEFT JOIN guards g ON g.id = n.guard_id
          WHERE g.supervisor_id = ${supId} OR n.guard_id IS NULL
          ORDER BY n.ts DESC
        `;
      } else {
        rows = await sql`SELECT * FROM notes_log ORDER BY ts DESC`;
      }
      return jsonResponse(rows);
    }

    if (req.method === 'POST') {
      const { guardId, guardName, text, by, ts } = await req.json();
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO notes_log (id, guard_id, guard_name, text, by_sup, ts)
        VALUES (${id}, ${guardId||null}, ${guardName||'General'}, ${text}, ${by}, ${ts})
      `;
      return jsonResponse({ ok: true, id });
    }

    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return errorResponse('id required', 400);
      await sql`DELETE FROM notes_log WHERE id = ${id}`;
      return jsonResponse({ ok: true });
    }

    return errorResponse('Method not allowed', 405);
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
