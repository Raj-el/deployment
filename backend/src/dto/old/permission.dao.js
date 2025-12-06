import { supabase } from "../../dbConfig/dbConfig.js";
import Permission from "../model/permission.model.js";

const TABLE = "permissions";

export default class PermissionDAO {
  static async getAll() {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    return data.map(Permission.fromRow);
  }

  static async findByCompanyAndRole(company_name, subrole) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("company_name", company_name)
      .eq("subrole", subrole);
    if (error) throw error;
    return data.map(Permission.fromRow);
  }

  static async findFeaturePermission(company_name, subrole, feature) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("company_name", company_name)
      .eq("subrole", subrole)
      .eq("feature", feature)
      .maybeSingle();
    if (error) throw error;
    return Permission.fromRow(data);
  }
}
