const UNKNOWN_OUTLET = 'UNKNOWN_OUTLET';

function normalizeName(value) {
  return String(value || '').trim();
}

function isUnknownName(name) {
  return !name || name.toUpperCase() === UNKNOWN_OUTLET;
}

function isAggregateRow(outletId, name) {
  const normalizedId = outletId.toUpperCase();
  const normalizedName = name.toUpperCase().replace(/[._-]+/g, ' ').replace(/\\s+/g, ' ').trim();
  return normalizedId === 'ALL' || normalizedName === 'ALL OUTLETS' || normalizedName === 'SEMUA OUTLET';
}

function normalizeOutletSummary(rows = []) {
  const grouped = new Map();

  for (const row of Array.isArray(rows) ? rows : []) {
    const outletId = normalizeName(row?.outlet_id);
    const name = normalizeName(row?.outlet_name);
    if (!outletId || isAggregateRow(outletId, name)) continue;

    const totalLogs = Number(row?.total_logs) || 0;
    const current = grouped.get(outletId) || {
      outlet_id: outletId,
      outlet_name: UNKNOWN_OUTLET,
      total_logs: 0,
    };

    current.total_logs += totalLogs;
    if (isUnknownName(current.outlet_name) && !isUnknownName(name)) {
      current.outlet_name = name;
    }
    grouped.set(outletId, current);
  }

  return Array.from(grouped.values()).sort((a, b) => {
    const aNumber = Number(a.outlet_id);
    const bNumber = Number(b.outlet_id);
    if (Number.isFinite(aNumber) && Number.isFinite(bNumber)) return aNumber - bNumber;
    return a.outlet_id.localeCompare(b.outlet_id);
  });
}

module.exports = { normalizeOutletSummary };
