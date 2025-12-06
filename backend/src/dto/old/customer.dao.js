import { supabase } from "../../dbConfig/dbConfig.js";
import CustomerModel from "../model/customer.model.js";

const TABLE = "customer_data";

class CustomerDAO {
  /**
   * Find a customer by account_id (exact match).
   * Returns CustomerModel instance or null.
   */
  static async findByAccountId(accountId) {
    if (!accountId) return null;
    const id = String(accountId).trim();

    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .eq("account_id", id)
        .maybeSingle();

      if (error) {
        console.error(`Error querying account_id '${id}':`, error.message);
        throw error;
      }

      if (!data) {
        console.warn(`No record found for account_id '${id}'`);
        return null;
      }

      return CustomerModel.fromRow(data);
    } catch (err) {
      console.error(`Unexpected error in findByAccountId:`, err.message);
      throw err;
    }
  }

  /**
   * Find all customers (optional limit)
   */
  static async findAll(limit = 1000) {
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .limit(limit);

      if (error) throw error;
      return data.map((row) => CustomerModel.fromRow(row));
    } catch (err) {
      console.error(`Error fetching all customers:`, err.message);
      throw err;
    }
  }

  /**
   * Find customers belonging to a specific client company.
   * @param {string} clientCompany - The client company name (e.g., "ScalePoint")
   */
  static async findByClientCompany(clientCompany) {
    if (!clientCompany) throw new Error("Missing clientCompany name");
    try {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .ilike("client_company", clientCompany); // case-insensitive match

      if (error) throw error;
      return data.map((row) => CustomerModel.fromRow(row));
    } catch (err) {
      console.error(`Error fetching customers for ${clientCompany}:`, err.message);
      throw err;
    }
  }

  /**
   * Insert a new customer row.
   * @param {CustomerModel|Object} customer
   */
  static async insert(customer) {
    const payload =
      customer instanceof CustomerModel ? customer.toJSON() : { ...customer };

    try {
      // Ensure consistent timestamp + optional client company tracking
      payload.created_at = new Date().toISOString();
      payload.updated_at = new Date().toISOString();

      const { data, error } = await supabase
        .from(TABLE)
        .insert([payload])
        .select()
        .single();

      if (error) throw error;
      return CustomerModel.fromRow(data);
    } catch (err) {
      console.error(`Error inserting customer:`, err.message);
      throw err;
    }
  }

  /**
   * Update a customer by account_id.
   * @param {string} accountId
   * @param {Object} updates
   */
  static async updateById(accountId, updates = {}) {
    if (!accountId) throw new Error("Missing account_id for update");
    try {
      const payload = {
        ...updates,
        updated_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from(TABLE)
        .update(payload)
        .eq("account_id", accountId)
        .select()
        .single();

      if (error) throw error;
      return CustomerModel.fromRow(data);
    } catch (err) {
      console.error(`Error updating customer ${accountId}:`, err.message);
      throw err;
    }
  }

  /**
   * Delete a customer by account_id.
   */
  static async deleteById(accountId) {
    if (!accountId) throw new Error("Missing account_id for delete");
    try {
      const { error } = await supabase
        .from(TABLE)
        .delete()
        .eq("account_id", accountId);
      if (error) throw error;
      return true;
    } catch (err) {
      console.error(`Error deleting customer ${accountId}:`, err.message);
      throw err;
    }
  }
}

export default CustomerDAO;
