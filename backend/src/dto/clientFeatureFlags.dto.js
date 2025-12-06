import { supabase } from '../dbConfig/dbConfig.js';
import { applyFilters, mapRowFactory, mapRowsFactory, nowIso } from './dto.helpers.js';
import ClientFeatureFlagsModel from '../model/clientFeatureFlags.model.js';

const TABLE = 'ClientFeatureFlags';
const PRIMARY_KEY = 'feature_flag_id';
const DEFAULT_ORDER_COLUMN = 'feature_name';

const mapRow = mapRowFactory(ClientFeatureFlagsModel);
const mapRows = mapRowsFactory(ClientFeatureFlagsModel);

class ClientFeatureFlagsDAO {
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
    if (error) throw new Error(`Failed to list ClientFeatureFlags: ${error.message}`);
    return mapRows(data);
  }

  static async findById(id) {
    if (!id) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq(PRIMARY_KEY, id)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientFeatureFlags record: ${error.message}`);
    return mapRow(data);
  }

  static async findByFeatureKey(clientId, featureKey) {
    if (!clientId || !featureKey) return null;
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('client_id', clientId)
      .eq('feature_key', featureKey)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch ClientFeatureFlags by key: ${error.message}`);
    return mapRow(data);
  }

  static async create(record = {}) {
    const timestamp = nowIso();
    const payload = {
      ...record,
      created_at: record.created_at ?? timestamp,
      updated_at: record.updated_at ?? timestamp,
    };

    if (record.last_toggled_by && !record.last_toggled_at) {
      payload.last_toggled_at = timestamp;
    }

    const { data, error } = await supabase.from(TABLE).insert([payload]).select().single();
    if (error) throw new Error(`Failed to create ClientFeatureFlags record: ${error.message}`);
    return mapRow(data);
  }

  static async updateById(id, updates = {}) {
    if (!id) throw new Error('Missing identifier for ClientFeatureFlags update');
    if (!updates || !Object.keys(updates).length) {
      return this.findById(id);
    }

    const timestamp = nowIso();
    const payload = {
      ...updates,
      updated_at: timestamp,
    };

    if (updates.is_enabled !== undefined) {
      payload.last_toggled_at = updates.last_toggled_at ?? timestamp;
    }

    const { data, error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq(PRIMARY_KEY, id)
      .select()
      .maybeSingle();

    if (error) throw new Error(`Failed to update ClientFeatureFlags record: ${error.message}`);
    return mapRow(data);
  }

  static async toggleFeature(
    clientId,
    featureKey,
    isEnabled,
    { userId, strategy, targetSegments, featureName, description } = {}
  ) {
    if (!clientId || !featureKey) {
      throw new Error('clientId and featureKey are required to toggle a feature flag');
    }

    const existing = await this.findByFeatureKey(clientId, featureKey);
    const timestamp = nowIso();
    const updates = {
      is_enabled: isEnabled,
      last_toggled_by: userId ?? existing?.lastToggledBy ?? null,
      last_toggled_at: timestamp,
      rollout_strategy: strategy ?? existing?.rolloutStrategy ?? 'full',
      target_segments: targetSegments ?? existing?.targetSegments ?? [],
      updated_at: timestamp,
    };

    if (existing) {
      return this.updateById(existing.featureFlagId, {
        ...updates,
        feature_name: featureName ?? existing.featureName,
        description: description ?? existing.description,
      });
    }

    return this.create({
      client_id: clientId,
      feature_key: featureKey,
      feature_name: featureName ?? featureKey,
      description: description ?? null,
      ...updates,
    });
  }

  static async deleteById(id) {
    if (!id) throw new Error('Missing identifier for ClientFeatureFlags delete');
    const { error } = await supabase.from(TABLE).delete().eq(PRIMARY_KEY, id);
    if (error) throw new Error(`Failed to delete ClientFeatureFlags record: ${error.message}`);
    return true;
  }
}

export default ClientFeatureFlagsDAO;
