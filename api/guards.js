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
        rows = await sql`SELECT * FROM guards WHERE supervisor_id = ${supId} ORDER BY name`;
      } else {
        rows = await sql`SELECT * FROM guards ORDER BY name`;
      }
      return jsonResponse(rows);
    }

    if (req.method === 'POST') {
      const body = await req.json();
      const guards = Array.isArray(body) ? body : [body];
      for (const g of guards) {
        const id = g.id || crypto.randomUUID();
        await sql`
          INSERT INTO guards (id, name, badge, phone, post, shift, rate, notes, employment_type, supervisor_id)
          VALUES (${id}, ${g.name}, ${g.badge||''}, ${g.phone||''}, ${g.post||''}, ${g.shift||''}, ${g.rate||null}, ${g.notes||''}, ${g.employment_type||''}, ${g.supervisor_id||null})
          ON CONFLICT (id) DO NOTHING
        `;
      }
      return jsonResponse({ ok: true });
    }

    if (req.method === 'DELETE') {
      const id = url.searchParams.get('id');
      if (!id) return errorResponse('id required', 400);
      await sql`DELETE FROM guards WHERE id = ${id}`;
      await sql`DELETE FROM events WHERE guard_id = ${id}`;
      await sql`DELETE FROM notes_log WHERE guard_id = ${id}`;
      return jsonResponse({ ok: true });
    }

    return errorResponse('Method not allowed', 405);
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
