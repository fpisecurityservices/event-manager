import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'GET,POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  try {
    await initTables();
    const sql = getDb();

    if (req.method === 'GET') {
      const url = new URL(req.url);
      const key = url.searchParams.get('key');
      if (!key) return errorResponse('key required', 400);
      const rows = await sql`SELECT value FROM meta WHERE key = ${key}`;
      return jsonResponse({ value: rows[0]?.value ?? null });
    }

    if (req.method === 'POST') {
      const { key, value } = await req.json();
      await sql`INSERT INTO meta (key, value) VALUES (${key}, ${value}) ON CONFLICT (key) DO UPDATE SET value = ${value}`;
      return jsonResponse({ ok: true });
    }

    return errorResponse('Method not allowed', 405);
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
