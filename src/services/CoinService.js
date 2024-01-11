import { supabaseAdmin } from "@/supabase/supabase-config";

export async function getAllCoinPrice() {
  const res = await supabaseAdmin
    .from("exchange_coin")
    .select(`*,updated_by(name)`)
    .order("price", { ascending: false });

  return res;
}
