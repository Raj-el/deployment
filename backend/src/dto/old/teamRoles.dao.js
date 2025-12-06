import { supabase } from "../dbConfig/dbConfig.js";
import TeamRole from "../model/teamRoles.model.js";

const TABLE = "team_roles";

export default class TeamRoleDAO {
  static async getAll() {
    const { data, error } = await supabase.from(TABLE).select("*");
    if (error) throw error;
    return data.map(TeamRole.fromRow);
  }

  static async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("email", email)
      .maybeSingle();
    if (error) throw error;
    return TeamRole.fromRow(data);
  }
}
