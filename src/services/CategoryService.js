import { supabase, supabaseAdmin } from "@/supabase/supabase-config";

export async function getAllCategory() {
  const res = await supabase
    .from("category_parent")
    .select()
    .order("id", { ascending: true });
  return res;
}
