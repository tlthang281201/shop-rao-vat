import { supabaseAdmin } from "@/supabase/supabase-config";

export async function getAllOrder() {
  const res = await supabaseAdmin
    .from("orders")
    .select(`*,buyer_id(name),seller_id(name),post_id(title,price,phone)`)
    .order("created_at", { ascending: false });

  return res;
}
