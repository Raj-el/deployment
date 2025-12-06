import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import ClientSubscriptionHistoryModel from '../model/clientSubscriptionHistory.model.js';

const TABLE = 'ClientSubscriptionHistory';
const PRIMARY_KEY = 'subscription_history_id';
const DEFAULT_ORDER_COLUMN = 'period_start';

const mapRow = mapRowFactory(ClientSubscriptionHistoryModel);
const mapRows = mapRowsFactory(ClientSubscriptionHistoryModel);

class ClientSubscriptionHistoryDAO {
  static async list({ filters = {}, limit = 100, orderBy = DEFAULT_ORDER_COLUMN, ascending = false } = {}) {
    let query = supabase.from(TABLE).select('*').limit(limit);
    query = applyFilters(query, filters);
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list ClientSubscriptionHistory: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientSubscriptionHistory record: ${error.message}`);
    return mapRow(data);
  }

  static async findByClientId(clientId, { limit = 50 } = {}) {
    if (!clientId) return [];
    return this.list({
      filters: { client_id: clientId },
      limit,
      orderBy: DEFAULT_ORDER_COLUMN,
      ascending: false,
    });
  }

  static async findLatestSnapshot(clientId) {
    const [record] = await this.findByClientId(clientId, { limit: 1 });
    return record ?? null;
  }

  static async create(record = {}) {
    const payload = { ...record };
    payload.recorded_at ??= nowIso();

    const { data, error } = await supabase
      .from(TABLE)
      .insert([payload])
      .select()
      .single();

    if (error) throw new Error(`Failed to create ClientSubscriptionHistory record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for subscription history update');
    if (!updates || !Object.keys(updates).length) {
      return this.findById(id);
    }

    const payload = { ...updates };

    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq(PRIMARY_KEY, id)
      .select()
      .maybeSingle();

    if (error) throw new Error(`Failed to update ClientSubscriptionHistory record: ${error.message}`);
    return mapRow(data);
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for ClientSubscriptionHistory delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete ClientSubscriptionHistory record: ${error.message}`);
    return true;
  }
}

export default ClientSubscriptionHistoryDAO;
