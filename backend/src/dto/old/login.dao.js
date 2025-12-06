import { supabase } from '../../dbConfig/dbConfig.js';
import LoginModel from '../model/login.model.js';

const TABLE = 'login';
const TEAM_TABLE = 'cs_team';
const EXPERT_TABLE = 'ex_database';

export default class LoginDAO {
  /**
   * Find a user by email.
   */
  static async findByEmail(email) {
    if (!email) return null;

    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email)
      .maybeSingle();

    if (error) throw new Error(`Failed to fetch login: ${error.message}`);
    return data ? LoginModel.fromRow(data) : null;
  }

  /**
   * Create a user only if email exists in cs_team or ex_database.
   */
  static async createUser({ email, passwordHash }) {
    if (!email || !passwordHash)
      throw new Error('Email and password hash are required');

    // Check if email exists in cs_team
    const { data: teamMember, error: teamError } = await supabase
      .from(TEAM_TABLE)
      .select('email')
      .eq('email', email)
      .maybeSingle();

    if (teamError)
      throw new Error(`Failed to verify cs_team membership: ${teamError.message}`);

    // Check if email exists in ex_database
    const { data: expertMember, error: expertError } = await supabase
      .from(EXPERT_TABLE)
      .select('Email')
      .eq('Email', email)
      .maybeSingle();

    if (expertError)
      throw new Error(
        `Failed to verify ex_database membership: ${expertError.message}`
      );

    // If not found in either → reject registration
    if (!teamMember && !expertMember)
      throw new Error(
        `Cannot create login — email '${email}' not found in cs_team or ex_database`
      );

    // Insert into login
    const { data, error } = await supabase
      .from(TABLE)
      .insert([{ email, password: passwordHash }])
      .select()
      .single();

    if (error)
      throw new Error(`Failed to create login for '${email}': ${error.message}`);

    return LoginModel.fromRow(data);
  }

  /**
   * Update password for an existing user.
   */
  static async updatePasswordByEmail(email, newHash) {
    if (!email || !newHash)
      throw new Error('Email and new password hash are required');

    const { data, error } = await supabase
      .from(TABLE)
      .update({ password: newHash })
      .eq('email', email)
      .select()
      .single();

    if (error)
      throw new Error(`Failed to update password for '${email}': ${error.message}`);

    return LoginModel.fromRow(data);
  }
}
