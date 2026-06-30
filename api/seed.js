import { getDb, initTables, jsonResponse, errorResponse } from './_db.js';

const SUPERVISORS = [
  { id: 'viv-jenn', name: 'Vivian & Jennifer' },
  { id: 'allen',    name: 'Gazwin Allen' },
  { id: 'boyle',    name: 'William Boyle' },
  { id: 'kevin',    name: 'Kevin Amaya' },
  { id: 'moya',     name: 'Ander Moya' },
  { id: 'peter',    name: 'Peter Sekusan' },
  { id: 'rocha',    name: 'Harold Rocha' },
];

const GUARDS = [
  // VIV & JENN
  { name: 'Angela Pacheco',           badge: '5005', phone: '786-382-1591', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Asline Dorastin',          badge: '3839', phone: '786-672-3975', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Berlinda Juste',           badge: '3893', phone: '786-750-8776', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Burjand Torres Lopez',     badge: '5022', phone: '305-916-1583', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Leibole Muchnik',          badge: '3558', phone: '786-510-5296', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Lystra Ethridge',          badge: '2933', phone: '904-485-3367', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Maxon Jean',               badge: '4537', phone: '305-934-1686', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Rachelle Indigene',        badge: '4416', phone: '954-851-2252', notes: 'Needs transportation', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Rose Julien',              badge: '4698', phone: '754-332-5804', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  { name: 'Sebastian Dominguez Jane', badge: '4855', phone: '786-587-6371', supervisor_id: 'viv-jenn', employment_type: 'W2' },
  // ALLEN
  { name: 'Bettina Harrison',      badge: '3613', phone: '561-970-7702', supervisor_id: 'allen' },
  { name: 'Chaney Andrews',        badge: '5056', phone: '305-494-7930', supervisor_id: 'allen' },
  { name: 'David Olaore',          badge: '2269', phone: '786-285-8000', supervisor_id: 'allen' },
  { name: 'Djamanson Petit Frere', badge: '4899', phone: '954-873-6635', supervisor_id: 'allen' },
  { name: 'Dukens Racine',         badge: '5258', phone: '754-299-8248', supervisor_id: 'allen' },
  { name: 'Joshua Rodney',         badge: '4610', phone: '786-255-3578', supervisor_id: 'allen' },
  { name: 'Michael Previl',        badge: '4883', phone: '954-225-7528', supervisor_id: 'allen' },
  { name: 'Rolfano Juste',         badge: '5233', phone: '954-497-9719', supervisor_id: 'allen' },
  { name: 'Ronald Dumersaint',     badge: '4755', phone: '954-604-0112', supervisor_id: 'allen' },
  { name: 'Sebastian Valenzuela',  badge: '4850', phone: '786-216-4276', supervisor_id: 'allen' },
  // BOYLE
  { name: 'Akheel Lewin',         phone: '443-600-7662', notes: 'Needs transportation',                    supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Anishka Campbell',     phone: '754-329-9117', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Armando Rodriguez',    phone: '784-723-5009', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Armonee Reed',         phone: '561-221-9876', notes: 'Needs transportation',                    supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Ashley Demarr',        phone: '954-439-3798', notes: 'Needs transportation',                    supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Ashley Lawrence',      phone: '786-857-4331', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Blanca Owen',          phone: '786-512-5609', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Blessence Grant',      phone: '786-477-1272', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Brianna Diaz',         phone: '786-665-2004', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Chaviss Mobley',       phone: '786-317-7658', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Christopher Vazquez',  phone: '786-633-8671', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Cordale Reed',         phone: '305-218-7865', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Diamond Wesley',       phone: '954-310-3430', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Dijon Thomas',         phone: '786-269-6028', notes: 'Schedule with Jon Anthony Delgado',       supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Domingo Garcia Diago', phone: '512-948-1462', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Dontavious Lockhart',  phone: '954-294-3393', notes: 'Needs transportation',                    supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Evernique Slocum',     phone: '305-206-3270', notes: 'Needs transportation',                    supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Franchesco Moreno',    phone: '786-354-6490', supervisor_id: 'boyle', employment_type: '1099' },
  { name: 'Frantz Fils Aime',     phone: '786-830-4044', supervisor_id: 'boyle', employment_type: '1099' },
  // KEVIN
  { name: 'Furman Walker',           phone: '954-529-6019', notes: 'Needs transportation',           supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Guirlaine Martin',        phone: '754-245-4025', supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Guyrveslhine Augustin',   phone: '561-293-9367', supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Idorky Martinez Valdes',  phone: '786-339-1976', supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Jada Steele',             phone: '786-973-0922', supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Javier Paulino',          phone: '954-709-4183', notes: 'Needs transportation',           supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Jean Zephir',             phone: '305-784-1553', supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Jemina Decius',           phone: '786-825-7702', supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Jon Anthony Delgado',     phone: '305-337-0592', notes: 'Schedule with Dijon Thomas',     supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Julia Saavedra',          phone: '305-900-3447', supervisor_id: 'kevin', employment_type: '1099' },
  { name: 'Nancyka Celestin',        phone: '786-826-3414', supervisor_id: 'kevin', employment_type: '1099' },
  // MOYA
  { name: 'Eugenio Mantilla Rodriguez', badge: '5353', phone: '305-763-4574', supervisor_id: 'moya' },
  { name: 'Fermaint Rios',              badge: '1412', phone: '239-220-9598', supervisor_id: 'moya' },
  { name: 'Jesus Dela Rosa',            badge: '457',  phone: '786-719-3200', supervisor_id: 'moya' },
  { name: 'Juan Fernadez',              badge: '1617', phone: '917-624-3308', supervisor_id: 'moya' },
  { name: 'Mayelin Cordova Muniz',      badge: '5304', phone: '786-512-8301', supervisor_id: 'moya' },
  { name: 'Ramon Malave',               badge: '2055', phone: '954-549-7108', supervisor_id: 'moya' },
  // PETER
  { name: 'Nicole Harris',       phone: '786-626-4698', notes: 'Needs transportation', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Paul Alcindor',       phone: '863-234-8828', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Pedro Antoine',       phone: '754-239-0855', notes: 'Needs transportation', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Roger Rodriguez Jr',  phone: '754-244-2524', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Shaniya Thomas',      phone: '786-847-9212', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Stephen Richard',     phone: '786-329-2211', notes: 'Needs transportation', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Thimothee Saul',      phone: '754-329-6018', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Veneta Irving',       phone: '786-316-1001', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Vilnord Simon',       phone: '305-498-7808', supervisor_id: 'peter', employment_type: '1099' },
  { name: 'Wolfgang Jean-Gilles',phone: '786-737-8581', supervisor_id: 'peter', employment_type: '1099' },
  // ROCHA
  { name: 'Angel Mursuli',    badge: '4167', phone: '786-426-4798', supervisor_id: 'rocha' },
  { name: 'Brittany Walker',  badge: '5257', phone: '954-882-5675', supervisor_id: 'rocha' },
  { name: 'Destinee Hollis',  badge: '5242', phone: '728-213-0452', supervisor_id: 'rocha' },
  { name: 'Gui Chen',         badge: '3577', phone: '786-368-0910', supervisor_id: 'rocha' },
  { name: 'Jahnjay Sampson',  badge: '5169', phone: '305-772-9869', supervisor_id: 'rocha' },
  { name: 'Kyle Sampson',     badge: '5182', phone: '954-955-0156', supervisor_id: 'rocha' },
  { name: 'Sherlock Henry',   badge: '5239', phone: '954-508-5074', supervisor_id: 'rocha' },
  { name: 'Yves Vilsaint',    badge: '3923', phone: '863-677-5726', supervisor_id: 'rocha' },
];

export default async function handler(req) {
  if (req.method === 'OPTIONS') return new Response('', { status: 204, headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST', 'Access-Control-Allow-Headers': 'Content-Type' } });
  if (req.method !== 'POST') return new Response('POST only', { status: 405 });
  try {
    await initTables();
    const sql = getDb();

    for (const s of SUPERVISORS) {
      await sql`INSERT INTO supervisors (id, name) VALUES (${s.id}, ${s.name}) ON CONFLICT (id) DO NOTHING`;
    }

    let inserted = 0;
    for (const g of GUARDS) {
      const existing = await sql`SELECT id FROM guards WHERE name = ${g.name} AND supervisor_id = ${g.supervisor_id}`;
      if (existing.length === 0) {
        const id = crypto.randomUUID();
        await sql`
          INSERT INTO guards (id, name, badge, phone, post, shift, rate, notes, employment_type, supervisor_id)
          VALUES (${id}, ${g.name}, ${g.badge||''}, ${g.phone||''}, ${g.post||''}, '', null, ${g.notes||''}, ${g.employment_type||''}, ${g.supervisor_id})
        `;
        inserted++;
      }
    }

    return jsonResponse({ ok: true, supervisors: SUPERVISORS.length, guards_inserted: inserted, guards_total: GUARDS.length });
  } catch (e) {
    return errorResponse(e.message);
  }
}

export const config = { runtime: 'edge' };
