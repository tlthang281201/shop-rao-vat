import { supabaseAdmin } from "@/supabase/supabase-config";

export async function addPost(data) {
  const {
    title,
    pcid,
    ccid,
    price,
    district,
    city,
    ward,
    address,
    description,
    name,
    phone,
    image,
    is_new,
    seller_id,
  } = data;
  const res = await supabaseAdmin.from("post").insert({
    title,
    cate_p_id: pcid,
    cate_c_id: ccid,
    price: price ? price : null,
    district_id: district,
    city_id: city,
    ward_id: ward,
    address,
    description,
    fullname: name,
    phone,
    images: image,
    detail: null,
    is_new: is_new === "0" ? true : false,
    seller_id,
  });
  return res;
}

export async function getAllPost() {
  const res = await supabaseAdmin
    .from("post")
    .select(
      `id,images,title,cate_c_id(name),price,city(name),district(name),ward(name),users(name),fullname,phone`
    )
    .match({ is_show: true, status: 1 });

  return res;
}

export async function getAllApprovalPost() {
  const res = await supabaseAdmin
    .from("post")
    .select(
      `*,id,images,title,cate_c_id(name),price,city(name),district(name),ward(name),users(name),fullname,phone`
    )
    .match({ is_show: true, status: 0, is_selling: false })
    .order("created_at", { ascending: false });

  return res;
}
