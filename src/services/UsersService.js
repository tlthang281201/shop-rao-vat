import { supabase, supabaseAdmin } from "@/supabase/supabase-config";

export async function getAllUser() {
  const res = await supabase
    .from("users")
    .select(`*, city(name),district(name),ward(name)`)
    .order("created_at", { ascending: false });
  return res;
}
