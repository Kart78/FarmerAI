import { supabase } from "./supabaseClient.js";

// Resize/compress in the browser before upload. Rural mobile connections are
// often slow or metered, so shipping a 4000x3000 phone-camera photo as-is is
// a bad default — this caps the longest edge and re-encodes as JPEG.
async function compressImage(file, maxDim = 1280, quality = 0.82) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Compression failed"))),
      "image/jpeg",
      quality
    );
  });
}

// Uploads a single photo file to the `listing-photos` bucket, scoped under
// the signed-in farmer's own folder (required by the storage RLS policies),
// and returns its public URL.
export async function uploadListingPhoto(file, farmerId) {
  if (!supabase) throw new Error("Supabase isn't configured.");
  if (!file.type.startsWith("image/")) throw new Error("Please choose an image file.");

  const compressed = await compressImage(file);
  const ext = "jpg";
  const path = `${farmerId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("listing-photos")
    .upload(path, compressed, { contentType: "image/jpeg", upsert: false });
  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("listing-photos").getPublicUrl(path);
  return data.publicUrl;
}
