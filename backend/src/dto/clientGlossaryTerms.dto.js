import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import ClientGlossaryTermsModel from '../model/clientGlossaryTerms.model.js';

const TABLE = 'ClientGlossaryTerms';
const PRIMARY_KEY = 'glossary_term_id';
const DEFAULT_ORDER_COLUMN = 'term';

const mapRow = mapRowFactory(ClientGlossaryTermsModel);
const mapRows = mapRowsFactory(ClientGlossaryTermsModel);

class ClientGlossaryTermsDAO {
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
    if (error) throw new Error(`Failed to list ClientGlossaryTerms: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientGlossaryTerms record: ${error.message}`);
    return mapRow(data);
  }

  static async findByTerm(clientId, term) {
    if (!clientId || !term) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('client_id', clientId)
      .ilike('term', term)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientGlossaryTerms by term: ${error.message}`);
    return mapRow(data);
  }

  static async create(record = {}) {
    const timestamp = nowIso();
    const payload = {
      ...record,
      created_at: record.created_at ?? timestamp,
      updated_at: record.updated_at ?? timestamp,
      last_reviewed_at: record.last_reviewed_at ?? timestamp,
    };

    const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();
    if (error) throw new Error(`Failed to create ClientGlossaryTerms record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for ClientGlossaryTerms update');
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

    if (error) throw new Error(`Failed to update ClientGlossaryTerms record: ${error.message}`);
    return mapRow(data);
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for ClientGlossaryTerms delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete ClientGlossaryTerms record: ${error.message}`);
    return true;
  }
}

export default ClientGlossaryTermsDAO;
