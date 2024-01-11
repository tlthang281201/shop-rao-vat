import { supabase, supabaseAdmin } from "@/supabase/supabase-config";

export async function getAllCategory() {
  const res = await supabase
    .from("category_parent")
    .select(`*, updated_by(name)`)
    .order("id", { ascending: false });
  return res;
}
