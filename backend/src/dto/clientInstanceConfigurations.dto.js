import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import ClientInstanceConfigurationsModel from '../model/clientInstanceConfigurations.model.js';

const TABLE = 'ClientInstanceConfigurations';
const PRIMARY_KEY = 'config_id';
const DEFAULT_ORDER_COLUMN = 'config_key';

const mapRow = mapRowFactory(ClientInstanceConfigurationsModel);
const mapRows = mapRowsFactory(ClientInstanceConfigurationsModel);

class ClientInstanceConfigurationsDAO {
  static async list({ filters = {}, clientId, limit = 100, orderBy = DEFAULT_ORDER_COLUMN, ascending = true } = {}) {
    const appliedFilters = { ...filters };
    if (clientId) {
      appliedFilters.client_id = clientId;
    }

    let query = supabase.from(TABLE).select('*').limit(limit);
    query = applyFilters(query, appliedFilters);
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }

    const { data, error } = await query;
    if (error) throw new Error(`Failed to list ClientInstanceConfigurations: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientInstanceConfigurations record: ${error.message}`);
    return mapRow(data);
  }

  static async findByKey(clientId, configKey) {
    if (!clientId || !configKey) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('client_id', clientId)
      .eq('config_key', configKey)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientInstanceConfigurations by key: ${error.message}`);
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
    if (error) throw new Error(`Failed to create ClientInstanceConfigurations record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for ClientInstanceConfigurations update');
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

    if (error) throw new Error(`Failed to update ClientInstanceConfigurations record: ${error.message}`);
    return mapRow(data);
  }

  static async upsertByKey(clientId, configKey, value, metadata = {}) {
    if (!clientId || !configKey) throw new Error('clientId and configKey are required for upsert');
    const existing = await this.findByKey(clientId, configKey);
    const payload = {
      config_value: value,
      description: metadata.description ?? existing?.description ?? null,
      is_locked: metadata.isLocked ?? existing?.isLocked ?? false,
      updated_by: metadata.updatedBy ?? existing?.updatedBy ?? null,
    };

    if (existing) {
      return this.updateById(existing.configId, payload);
    }

    return this.create({
      client_id: clientId,
      config_key: configKey,
      ...payload,
    });
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for ClientInstanceConfigurations delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete ClientInstanceConfigurations record: ${error.message}`);
    return true;
  }
}

export default ClientInstanceConfigurationsDAO;
