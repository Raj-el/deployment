import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import SuperAdminsModel from '../model/superAdmins.model.js';

const TABLE = 'SuperAdmins';
const PRIMARY_KEY = 'superadmin_id';
const DEFAULT_ORDER_COLUMN = 'created_at';

const mapRow = mapRowFactory(SuperAdminsModel);
const mapRows = mapRowsFactory(SuperAdminsModel);

/**
 * Platform super admin assignments.
 */
class SuperAdminsDAO {
  static async list({ filters = {}, limit = 1000, orderBy = DEFAULT_ORDER_COLUMN, ascending = true } = {}) {
    let query = supabase.from(TABLE).select('*').limit(limit);
    query = applyFilters(query, filters);
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list SuperAdmins: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch SuperAdmins record: ${error.message}`);
    return mapRow(data);
  }

  static async create(record = {}) {
    const payload = { ...record };
    const timestamp = nowIso();
    payload.created_at ??= timestamp;
    payload.updated_at ??= timestamp;

    const { data, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create SuperAdmins record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for SuperAdmins update');
    if (!updates || !Object.keys(updates).length) {
      return this.findById(id);
    }

    const payload = { ...updates, updated_at: nowIso() };

    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq(PRIMARY_KEY, id)
      .select()
      .maybeSingle();

    if (error) throw new Error(`Failed to update SuperAdmins record: ${error.message}`);
    return mapRow(data);
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for SuperAdmins delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete SuperAdmins record: ${error.message}`);
    return true;
  }
}

export default SuperAdminsDAO;
