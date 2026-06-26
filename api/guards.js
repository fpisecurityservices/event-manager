import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST,DELETE', 'Access-Control-Allow-Headers': 'Content-Type' } });
  try {
    await initTables();
    const sql = getDb();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM guards ORDER BY name`;
      return jsonResponse(rows);
    }

    if (req.method === 'POST') {
      const body = await req.json();
      // Support single guard or array of guards
      const guards = Array.isArray(body) ? body : [body];
      const inserted = [];
      for (const g of guards) {
        const id = g.id || crypto.randomUUID();
        await sql`
          INSERT INTO guards (id, name, badge, post, shift, rate)
          VALUES (${id}, ${g.name}, ${g.badge || ''}, ${g.post || ''}, ${g.shift || ''}, ${g.rate || null})
          ON CONFLICT (id) DO NOTHING
        `;
        inserted.push(id);
      }
      return jsonResponse({ ok: true, inserted });
    }

    if (req.method === 'DELETE') {
      const url = new URL(req.url);
      const id = url.searchParams.get('id');
      if (!id) return errorResponse('id required', 400);
      await sql`DELETE FROM guards WHERE id = ${id}`;
      return jsonResponse({ ok: true });
    }

    return errorResponse('Method not allowed', 405);
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
