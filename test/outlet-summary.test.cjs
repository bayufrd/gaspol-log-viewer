const assert = require('node:assert/strict');
const { normalizeOutletSummary } = require('../lib/outletSummary');

const result = normalizeOutletSummary([
  { outlet_id: '1', outlet_name: 'Jempolan Coffee & Eatery', total_logs: 10 },
  { outlet_id: '1', outlet_name: 'UNKNOWN_OUTLET', total_logs: 3 },
  { outlet_id: '4', outlet_name: 'Development Testing', total_logs: 5 },
  { outlet_id: '4', outlet_name: 'Testdev', total_logs: 2 },
  { outlet_id: '9', outlet_name: 'UNKNOWN_OUTLET', total_logs: 7 },
  { outlet_id: 'ALL', outlet_name: 'Semua Outlet', total_logs: 999 },
  { outlet_id: '999', outlet_name: 'ALL OUTLETS', total_logs: 999 },
  { outlet_id: '998', outlet_name: 'semua_outlet', total_logs: 999 },
]);

assert.deepEqual(result, [
  { outlet_id: '1', outlet_name: 'Jempolan Coffee & Eatery', total_logs: 13 },
  { outlet_id: '4', outlet_name: 'Development Testing', total_logs: 7 },
  { outlet_id: '9', outlet_name: 'UNKNOWN_OUTLET', total_logs: 7 },
]);
console.log('outlet summary test passed');
