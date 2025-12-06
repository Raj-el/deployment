import { supabase } from "../../dbConfig/dbConfig.js";
import SuperAdmin from "../model/superAdmin.model.js";

const TABLE = "superadmins";

export default class SuperAdminDAO {
  static async getAll() {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    return data.map(SuperAdmin.fromRow);
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return SuperAdmin.fromRow(data);
  }
}
