const nowIso = () => new Date().toISOString();

const mapRowFactory = (Model) => (row) => (row ? Model.fromRow(row) : null);

const mapRowsFactory = (Model) => (rows = []) =>
  Array.isArray(rows) ? rows.map((row) => Model.fromRow(row)) : [];

const applyFilters = (query, filters = {}) => {
  if (!filters) return query;

  for (const [column, value] of Object.entries(filters)) {
    if (value === undefined || value === null) continue;

    if (Array.isArray(value)) {
      query = query.in(column, value);
      continue;
    }

    if (typeof value === 'object' && value !== null) {
      const { op, value: operand } = value;
      if (operand === undefined) continue;

      switch (op) {
        case 'like':
          query = query.like(column, operand);
          break;
        case 'ilike':
          query = query.ilike(column, operand);
          break;
        case 'gt':
          query = query.gt(column, operand);
          break;
        case 'gte':
          query = query.gte(column, operand);
          break;
        case 'lt':
          query = query.lt(column, operand);
          break;
        case 'lte':
          query = query.lte(column, operand);
          break;
        case 'neq':
          query = query.neq(column, operand);
          break;
        default:
          query = query.eq(column, operand);
      }
      continue;
    }

    query = query.eq(column, value);
  }

  return query;
};

export { nowIso, mapRowFactory, mapRowsFactory, applyFilters };
