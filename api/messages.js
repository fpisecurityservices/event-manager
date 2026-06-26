import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  try {
    await initTables();
    const sql = getDb();

    if (req.method === 'GET') {
      const rows = await sql`SELECT * FROM messages ORDER BY ts ASC`;
      return jsonResponse(rows);
    }

    if (req.method === 'POST') {
      const { type, sender, text, ts } = await req.json();
      const id = crypto.randomUUID();
      await sql`
        INSERT INTO messages (id, type, sender, text, ts)
        VALUES (${id}, ${type}, ${sender}, ${text}, ${ts})
      `;
      return jsonResponse({ ok: true, id });
    }

    return errorResponse('Method not allowed', 405);
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
