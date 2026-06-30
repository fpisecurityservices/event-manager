import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  if (req.method !== 'POST') return new Response('POST only', { status: 405 });
  try {
    const sql = getDb();

    const [{ before }] = await sql`SELECT COUNT(*) AS before FROM guards`;

    await sql`
      DELETE FROM guards WHERE id IN (
        SELECT id FROM (
          SELECT id, ROW_NUMBER() OVER (PARTITION BY name, supervisor_id ORDER BY id) AS rn
          FROM guards
        ) t WHERE rn > 1
      )
    `;

    const [{ after }] = await sql`SELECT COUNT(*) AS after FROM guards`;

    return jsonResponse({ ok: true, before: parseInt(before), after: parseInt(after), removed: parseInt(before) - parseInt(after) });
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
