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
    const rows = data.packages || data.data || data.items || (Array.isArray(data) ? data : []);
    const pagination = data.pagination || {
      page,
      limit: PAGE_LIMIT,
      total: rows.length,
      totalPages: Math.ceil(rows.length / PAGE_LIMIT) || 1,
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
    const rows = data.packages || data.data || data.items || (Array.isArray(data) ? data : []);
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
  createPackage: async (payload, thumbnail) => {
    let uploadedKey = null;

    if (thumbnail) {
      const { key } = await uploadImageToS3(thumbnail);
      uploadedKey = key;
    }

    const finalPayload = {
      ...payload,
      ...(uploadedKey && { thumbnailUrlKey: uploadedKey }),
    };

    try {
      await api.post("/package", finalPayload);
    } catch (err) {
      if (uploadedKey) await rollbackS3Upload(uploadedKey);
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
  updatePackage: async (packageId, payload, thumbnail, existingThumbnailKey) => {
    let uploadedKey = null;

    if (thumbnail) {
      const { key } = await uploadImageToS3(thumbnail);
      uploadedKey = key;
    }

    const finalPayload = {
      ...payload,
      ...(uploadedKey
        ? { thumbnailUrlKey: uploadedKey }
        : existingThumbnailKey
          ? { thumbnailUrlKey: existingThumbnailKey }
          : {}),
    };

    try {
      await api.put(`/package/${packageId}`, finalPayload);
    } catch (err) {
      if (uploadedKey) await rollbackS3Upload(uploadedKey);
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
};