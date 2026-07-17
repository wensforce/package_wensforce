import api from "../../../axios/axios";
import { uploadImageToS3, rollbackS3Upload } from "../../utils/s3Upload";
const PAGE_LIMIT = 10;
export const packageApi = {
  /**
   * Fetch paginated packages with optional search.
   * @param {object} options
   * @param {number} options.page   - Current page number
   * @param {string} options.search - Search query string
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchPackages: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/package", { params });
    const data = res.data?.data ?? res.data ?? {};
    const rows =
      data.packages ||
      data.data ||
      data.items ||
      (Array.isArray(data) ? data : []);
    const pagination = data.pagination || {
      page: data.page || page || 1,
      limit: data.limit || PAGE_LIMIT,
      total: data.total !== undefined ? data.total : rows.length,
      totalPages: Math.ceil((data.total !== undefined ? data.total : rows.length) / (data.limit || PAGE_LIMIT)) || 1,
    };

    return {
      rows: Array.isArray(rows) ? rows : [],
      pagination,
    };
  },

  /**
   * Search packages by query string (used for autocomplete/suggestions).
   * @param {string} query - Search term (package name)
   * @returns {Promise<Array>} - Up to 5 matching package rows
   */
  searchPackages: async (query) => {
    const res = await api.get("/package", {
      params: { search: query, page: 1, limit: 5 },
    });
    const data = res.data?.data ?? res.data ?? {};
    const rows =
      data.packages ||
      data.data ||
      data.items ||
      (Array.isArray(data) ? data : []);
    return Array.isArray(rows) ? rows.slice(0, 5) : [];
  },
  /**
   * Fetch a single package by ID, including associated services.
   * @param {number|string} id - Package ID
   * @returns {Promise<object|null>} - Package data, or null if not found
   */
  getPackageById: async (id) => {
    const res = await api.get(`/package/${id}`);
    return res.data?.data ?? null;
  },

  /**
   * Create a new package.
   * Handles S3 upload and rolls back on API failure.
   * @param {object} payload - Package fields (without thumbnailUrlKey)
   * @param {File|null} thumbnail - New image file (optional)
   * @returns {Promise<void>}
   */
  createPackage: async (payload, thumbnail, photoFiles = [], videoFiles = []) => {
  let uploadedThumbnailKey = null;
  const uploadedImageKeys = [];
  const uploadedVideoKeys = [];

  try {
    // Upload thumbnail
    if (thumbnail) {
      const { key } = await uploadImageToS3(thumbnail);
      uploadedThumbnailKey = key;
    }

    // Upload photos
    for (const file of photoFiles) {
      const { key } = await uploadImageToS3(file);
      uploadedImageKeys.push(key);
    }

    // Upload videos
    for (const file of videoFiles) {
      const { key } = await uploadImageToS3(file); // use uploadVideoToS3 if you have one
      uploadedVideoKeys.push(key);
    }
    const finalPayload = {
      ...payload,
      ...(uploadedThumbnailKey && { thumbnailUrlKey: uploadedThumbnailKey }),
      images: uploadedImageKeys,
      videos: uploadedVideoKeys,
    };

    await api.post("/package", finalPayload);

  } catch (err) {
    // Rollback all uploaded files on failure
    const allKeys = [uploadedThumbnailKey, ...uploadedImageKeys, ...uploadedVideoKeys].filter(Boolean);
    await Promise.all(allKeys.map((key) => rollbackS3Upload(key)));
    throw err;
  }
},

  /**
   * Update an existing package.
   * Handles S3 upload and rolls back on API failure.
   * @param {number|string} packageId - Package ID
   * @param {object} payload - Package fields (without thumbnailUrlKey)
   * @param {File|null} thumbnail - New image file (optional)
   * @param {string|null} existingThumbnailKey - Existing S3 key (if no new upload)
   * @returns {Promise<void>}
   */
  updatePackage: async (
  packageId,
  payload,
  thumbnail,
  existingThumbnailKey,
  photoFiles = [],
  videoFiles = [],
) => {
  let uploadedKey = null;
  const uploadedImageKeys = [];
  const uploadedVideoKeys = [];

  try {
    // Upload thumbnail
    if (thumbnail) {
      const { key } = await uploadImageToS3(thumbnail);
      uploadedKey = key;
    }

    // Upload photos
    for (const file of photoFiles) {
      const { key } = await uploadImageToS3(file);
      uploadedImageKeys.push(key);
    }

    // Upload videos
    for (const file of videoFiles) {
      const { key } = await uploadImageToS3(file);
      uploadedVideoKeys.push(key);
    }
    const finalPayload = {
      ...payload,
      ...(uploadedKey
        ? { thumbnailUrlKey: uploadedKey }
        : existingThumbnailKey
          ? { thumbnailUrlKey: existingThumbnailKey }
          : {}),
      images: uploadedImageKeys,
      videos: uploadedVideoKeys,
    };

    await api.put(`/package/${packageId}`, finalPayload);

  } catch (err) {
    // Rollback all uploaded files on failure
    const allKeys = [uploadedKey, ...uploadedImageKeys, ...uploadedVideoKeys].filter(Boolean);
    await Promise.all(allKeys.map((key) => rollbackS3Upload(key)));
    throw err;
  }
},
  /**
   * Delete a package by ID.
   * @param {number|string} id - Package ID to delete
   * @returns {Promise<void>}
   */
  deletePackage: async (id) => {
    await api.delete(`/package/${id}`);
  },

  /**
   * Import packages file.
   * @param {File} file - Excel/CSV/JSON file
   * @returns {Promise<any>}
   */
  importPackages: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const res = await api.post("/admin/import?target=packages", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },

  /**
   * Export packages file.
   * @param {string} format - xlsx, csv, json
   * @returns {Promise<object>} - Axios response with blob
   */
  exportPackages: async (format) => {
    return await api.get(`/admin/export?target=packages&type=${format}`, {
      responseType: "blob",
    });
  },
};
