import api from "@/app/axios/axios";

export const s3Api = {
  /**
   * Request a presigned PUT URL from the backend.
   * @param {{ filename: string, contentType: string }} params
   * @returns {Promise<{ uploadUrl: string, publicUrl: string, key: string }>}
   */
  getPresignedUrl: async ({ filename, contentType }) => {
    const res = await api.post("/upload/presign", {
      filename,
      contentType,
    });
    return res.data.data; // { uploadUrl, publicUrl, key }
  },

  /**
   * Delete a previously uploaded object from S3 (rollback).
   * @param {string} key - The S3 object key returned by getPresignedUrl
   * @returns {Promise<void>}
   */
  deleteS3Object: async (key) => {
    await api.delete("/upload/delete", { data: { key } });
  },
};
