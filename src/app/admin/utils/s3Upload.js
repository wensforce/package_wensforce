import { s3Api } from "./apis/s3.api";
/**
 * Step 1 — Upload the file directly to S3 using a presigned URL.
 * Uses fetch so we can set exact headers without the axios interceptors
 * adding an Authorization header (S3 rejects unknown headers).
 * @param {string} uploadUrl
 * @param {File} file
 */
async function putFileToS3(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": file.type,
      "Content-Disposition": "inline",
    },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText}`);
  }
}

/**
 * Orchestrates the full upload flow:
 *  1. Get a presigned URL
 *  2. PUT the file to S3
 *
 * Returns the `publicUrl` and `key` for use when creating the resource.
 * Throws on any failure — no partial state is left on S3 because the
 * PUT is the last step.
 *
 * @param {File} file
 * @returns {Promise<{ publicUrl: string, key: string }>}
 */
export async function uploadImageToS3(file) {
  const { uploadUrl, publicUrl, key } = await s3Api.getPresignedUrl({
    filename: file.name,
    contentType: file.type,
  });
  await putFileToS3(uploadUrl, file);
  return { publicUrl, key };
}

/**
 * Rolls back an already-uploaded S3 object.
 * Swallows errors so a rollback failure never masks the original error.
 * @param {string} key
 */
export async function rollbackS3Upload(key) {
  try {
    await s3Api.deleteS3Object(key);
  } catch {
    // Rollback is best-effort; log silently in production
    console.warn("[s3Upload] Rollback failed for key:", key);
  }
}
