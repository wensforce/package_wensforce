import api from "../../axios/axios";

/**
 * Step 1 — Request a presigned PUT URL from the backend.
 *
 * @param {File} file
 * @returns {Promise<{ uploadUrl: string; publicUrl: string; key: string }>}
 */
async function getPresignedUrl(file) {
  const res = await api.post("/upload/presign", {
    filename:    file.name,
    contentType: file.type,
  });
  return res.data.data; // { uploadUrl, publicUrl, key }
}

/**
 * Step 2 — Upload the file directly to S3 using the presigned URL.
 * Uses fetch so we can set exact headers without the axios interceptors
 * adding an Authorization header (S3 rejects unknown headers).
 *
 * @param {string} uploadUrl
 * @param {File} file
 */
async function putFileToS3(uploadUrl, file) {
  const res = await fetch(uploadUrl, {
    method:  "PUT",
    headers: {
      "Content-Type":        file.type,
      "Content-Disposition": "inline",
    },
    body: file,
  });
  if (!res.ok) {
    throw new Error(`S3 upload failed: ${res.status} ${res.statusText}`);
  }
}

/**
 * Step 3 (rollback) — Delete a previously uploaded object from S3.
 *
 * @param {string} key - The S3 object key returned by getPresignedUrl
 */
async function deleteS3Object(key) {
  await api.delete("/upload/delete", { data: { key } });
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
 * @returns {Promise<{ publicUrl: string; key: string }>}
 */
export async function uploadImageToS3(file) {
  const { uploadUrl, publicUrl, key } = await getPresignedUrl(file);
  await putFileToS3(uploadUrl, file);
  return { publicUrl, key };
}

/**
 * Rolls back an already-uploaded S3 object.
 * Swallows errors so a rollback failure never masks the original error.
 *
 * @param {string} key
 */
export async function rollbackS3Upload(key) {
  try {
    await deleteS3Object(key);
  } catch {
    // Rollback is best-effort; log silently in production
    console.warn("[s3Upload] Rollback failed for key:", key);
  }
}
