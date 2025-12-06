import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import RolePermissionsModel from '../model/rolePermissions.model.js';

const TABLE = 'RolePermissions';
const PRIMARY_KEY = 'role_permission_id';
const DEFAULT_ORDER_COLUMN = 'created_at';

const mapRow = mapRowFactory(RolePermissionsModel);
const mapRows = mapRowsFactory(RolePermissionsModel);

/**
 * Permission rules tied to job functions.
 */
class RolePermissionsDAO {
  static async list({ filters = {}, limit = 1000, orderBy = DEFAULT_ORDER_COLUMN, ascending = true } = {}) {
    let query = supabase.from(TABLE).select('*').limit(limit);
    query = applyFilters(query, filters);
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list RolePermissions: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch RolePermissions record: ${error.message}`);
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

    if (error) throw new Error(`Failed to create RolePermissions record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for RolePermissions update');
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

    if (error) throw new Error(`Failed to update RolePermissions record: ${error.message}`);
    return mapRow(data);
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for RolePermissions delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete RolePermissions record: ${error.message}`);
    return true;
  }

  static async upsertPermission({
    job_function_id,
    resource_type,
    action,
    scope,
    created_by,
  }) {
    if (!job_function_id || !resource_type || !action) {
      throw new Error('job_function_id, resource_type, and action are required');
    }

    const timestamp = nowIso();
    const payload = {
      job_function_id,
      resource_type,
      action,
      scope: scope ?? null,
      created_by: created_by ?? null,
      created_at: timestamp,
      updated_at: timestamp,
    };

    const { data, error } = await supabase
      .from(TABLE)
      .upsert(payload, { onConflict: 'job_function_id,resource_type,action' })
      .select()
      .maybeSingle();

    if (error) throw new Error(`Failed to upsert RolePermissions record: ${error.message}`);
    return mapRow(data);
  }

  static async deletePermission(jobFunctionId, resourceType, action) {
    if (!jobFunctionId || !resourceType || !action) return true;
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('job_function_id', jobFunctionId)
      .eq('resource_type', resourceType)
      .eq('action', action);
    if (error) throw new Error(`Failed to delete RolePermissions record: ${error.message}`);
    return true;
  }
}

export default RolePermissionsDAO;
