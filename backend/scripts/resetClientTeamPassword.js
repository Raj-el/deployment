import bcrypt from "bcrypt";
import { createClient } from "@supabase/supabase-js";

let URI = "URI";
let KEY = "service_key";

const supabase = createClient(
  URI,
  KEY // MUST be service key
);

async function resetClientTeamPasswords() {
  // 1. Get all user_ids from ClientTeam
  const { data: clientTeam, error: teamErr } = await supabase
    .from("ClientTeam")
    .select("user_id");

  if (teamErr) {
    console.error("Failed fetching ClientTeam:", teamErr);
    return;
  }

  console.log("Users to update:", clientTeam.length);

  const password = "NewPassw0rd!";
  const saltRounds = 10;

  for (const { user_id } of clientTeam) {
    const hashed = await bcrypt.hash(password, saltRounds);

    // 2. Update each user
    const { error: updateErr } = await supabase
      .from("Users")
      .update({ password_hash: hashed })
      .eq("user_id", user_id);

    if (updateErr) {
      console.error("Failed updating", user_id, updateErr);
    } else {
      console.log("Updated:", user_id);
    }
  }

  console.log("Done!");
}

resetClientTeamPasswords();
