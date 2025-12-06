import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import ClientApiKeysModel from '../model/clientApiKeys.model.js';

const TABLE = 'ClientApiKeys';
const PRIMARY_KEY = 'api_key_id';
const DEFAULT_ORDER_COLUMN = 'created_at';

const mapRow = mapRowFactory(ClientApiKeysModel);
const mapRows = mapRowsFactory(ClientApiKeysModel);

class ClientApiKeysDAO {
  static async list({
    filters = {},
    clientId,
    includeRevoked = false,
    limit = 100,
    orderBy = DEFAULT_ORDER_COLUMN,
    ascending = false,
  } = {}) {
    const appliedFilters = { ...filters };
    if (clientId) {
      appliedFilters.client_id = clientId;
    }

    let query = supabase.from(TABLE).select('*').limit(limit);
    query = applyFilters(query, appliedFilters);
    if (!includeRevoked) {
      query = query.is('revoked_at', null);
    }
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to list ClientApiKeys: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientApiKeys record: ${error.message}`);
    return mapRow(data);
  }

  static async findByName(clientId, name) {
    if (!clientId || !name) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('client_id', clientId)
      .ilike('name', name)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientApiKeys by name: ${error.message}`);
    return mapRow(data);
  }

  static async create(record = {}) {
    const timestamp = nowIso();
    const payload = {
      ...record,
      created_at: record.created_at ?? timestamp,
      updated_at: record.updated_at ?? timestamp,
    };

    const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();
    if (error) throw new Error(`Failed to create ClientApiKeys record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for ClientApiKeys update');
    if (!updates || !Object.keys(updates).length) {
      return this.findById(id);
    }

    const payload = {
      ...updates,
      updated_at: nowIso(),
    };

    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq(PRIMARY_KEY, id)
      .select()
      .maybeSingle();

    if (error) throw new Error(`Failed to update ClientApiKeys record: ${error.message}`);
    return mapRow(data);
  }

  static async revokeById(id, revokedByUserId) {
    if (!id) throw new Error('Missing identifier for ClientApiKeys revoke');
    const timestamp = nowIso();
    return this.updateById(id, {
      revoked_at: timestamp,
      revoked_by: revokedByUserId ?? null,
    });
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for ClientApiKeys delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete ClientApiKeys record: ${error.message}`);
    return true;
  }
}

export default ClientApiKeysDAO;
