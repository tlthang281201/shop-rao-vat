import { supabaseAdmin } from "@/supabase/supabase-config";

export async function getAllSlide() {
  const res = await supabaseAdmin
    .from("slides")
    .select()
    .order("created_at", { ascending: false });

  return res;
}
