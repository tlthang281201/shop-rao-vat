import { supabase, supabaseAdmin } from "@/supabase/supabase-config";

export async function getAllAccount(col) {
  const res = await supabase
    .from("account_admin")
    .select(col)
    .order("id", { ascending: true });
  return res;
}
export async function deleteAccount(id) {
  const res = await supabase.from("account_admin").delete().eq("id", id);
  return res;
}
export async function updateAccount(
  id,
  fullname,
  role,
  address,
  email,
  phone,
  pass,
  active
) {
  const res = await supabase
    .from("account_admin")
    .update({
      name: fullname,
      role_id: role,
      address: address,
      email: email,
      phone: phone,
      password: pass,
      active: active,
    })
    .eq("id", id);
  return res;
}
export async function updateStatus(id, active) {
  const res = await supabase
    .from("account_admin")
    .update({
      active: active,
    })
    .eq("id", id);
  return res;
}
