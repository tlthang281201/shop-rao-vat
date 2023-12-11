import { supabaseAdmin } from "@/supabase/supabase-config";
function getRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}
export default async function upImage(file) {
  const timestamp = Date.now();
  const randomString = getRandomString(3);
  const fileExtension = file.name.split(".").pop();
  const fileName = `image_${randomString}${timestamp}.${fileExtension}`;
  const { data, error } = await supabaseAdmin.storage
    .from("post_images")
    .upload(`public/${fileName}`, file, {
      upsert: false,
    });
  return fileName;
}
