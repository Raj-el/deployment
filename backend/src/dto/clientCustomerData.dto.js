import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import ClientCustomerDataModel from '../model/clientCustomerData.model.js';

const TABLE = 'ClientCustomerData';
const PRIMARY_KEY = 'account_id';
const DEFAULT_ORDER_COLUMN = 'created_at';

const mapRow = mapRowFactory(ClientCustomerDataModel);
const mapRows = mapRowsFactory(ClientCustomerDataModel);

/**
 * Detailed customer/account metrics per client.
 */
class ClientCustomerDataDAO {
  static async list({ filters = {}, limit = 1000, orderBy = DEFAULT_ORDER_COLUMN, ascending = true } = {}) {
    let query = supabase.from(TABLE).select('*').limit(limit);
    query = applyFilters(query, filters);
    if (orderBy) {
      query = query.order(orderBy, { ascending });
    }
    const { data, error } = await query;
    if (error) throw new Error(`Failed to list ClientCustomerData: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientCustomerData record: ${error.message}`);
    return mapRow(data);
  }

  static async findByAccountId(accountId) {
    if (!accountId) return null;
    const [record] = await this.list({
      filters: { account_id: accountId },
      limit: 1,
    });
    return record ?? null;
  }

  static async findByClientId(clientId, { limit = 1000 } = {}) {
    if (!clientId) return [];
    return this.list({ filters: { client_id: clientId }, limit });
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

    if (error) throw new Error(`Failed to create ClientCustomerData record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for ClientCustomerData update');
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

    if (error) throw new Error(`Failed to update ClientCustomerData record: ${error.message}`);
    return mapRow(data);
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for ClientCustomerData delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete ClientCustomerData record: ${error.message}`);
    return true;
  }
}

export default ClientCustomerDataDAO;
