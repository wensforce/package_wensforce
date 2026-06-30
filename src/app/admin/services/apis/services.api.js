import api from "@/app/axios/axios";
import { uploadImageToS3, rollbackS3Upload } from "../../utils/s3Upload";
const PAGE_LIMIT = 10;
function getArrayFromResponse(data, keys) {
  for (const key of keys) {
    const value = data?.[key];
    if (Array.isArray(value)) return value;
  }
  return [];
}

export const servicesApi = {
  /**
   * Fetch paginated services with optional search.
   * @param {object} options
   * @param {number} options.page   - Current page number
   * @param {string} options.search - Search query string (title)
   * @returns {Promise<{ rows: Array, pagination: object }>}
   */
  fetchServices: async ({ page, search }) => {
    const params = { page, limit: PAGE_LIMIT };
    if (search && search.trim()) params.search = search.trim();

    const res = await api.get("/service/list", { params });
    const { services: rows, pagination: pg } = res.data.data;

    return {
      rows,
      pagination: {
        ...pg,
        totalPages: Math.max(1, Math.ceil(pg.total / pg.limit)),
      },
    };
  },

  /**
   * Search services by query string.
   * @param {string} query - Search term (service name)
   * @returns {Promise<Array>} - Up to 5 matching service rows
   */
  searchServices: async (query) => {
    const res = await api.get("/service/list", {
      params: { search: query, page: 1, limit: 5 },
    });
    const data = res.data?.data ?? res.data ?? {};
    const rows = getArrayFromResponse(data, ["services", "items", "data"]);
    return Array.isArray(rows) ? rows.slice(0, 5) : [];
  },
/**
   * Fetch a single service by ID.
   * @param {number|string} id - Service ID
   * @returns {Promise<object|null>}
   */
  getServiceById: async (id) => {
    const res = await api.get(`/service/${id}`);
    return res.data?.data ?? null;
  },
  /**
   * Create a new service.
   * Handles S3 upload and rolls back on API failure.
   * @param {{ title: string, description: string, isActive: boolean }} form
   * @param {File|null} thumbnail - New image file (optional)
   * @returns {Promise<void>}
   */
  createService: async (form, thumbnail) => {
    let uploadedKey = null;

    if (thumbnail) {
      const { key } = await uploadImageToS3(thumbnail);
      uploadedKey = key;
    }

    const payload = {
      title: form.title.trim(),
      isActive: form.isActive,
      ...(form.description.trim() && { description: form.description.trim() }),
      ...(uploadedKey && { thumbnailUrlKey: uploadedKey }),
    };

    try {
      await api.post("/service/create", payload);
    } catch (err) {
      if (uploadedKey) await rollbackS3Upload(uploadedKey);
      throw err;
    }
  },

  /**
   * Update an existing service.
   * Handles S3 upload and rolls back on API failure.
   * @param {number|string} id - Service ID
   * @param {{ title: string, description: string, isActive: boolean }} form
   * @param {File|null} thumbnail - New image file (optional)
   * @returns {Promise<object>} - Updated service data
   */
  updateService: async (id, form, thumbnail) => {
    let uploadedKey = null;

    if (thumbnail) {
      const { key } = await uploadImageToS3(thumbnail);
      uploadedKey = key;
    }

    const payload = {
      title: form.title.trim(),
      isActive: form.isActive,
      ...(form.description.trim() && { description: form.description.trim() }),
      ...(uploadedKey && { thumbnailUrlKey: uploadedKey }),
    };

    try {
      const res = await api.put(`/service/${id}`, payload);
      return res.data.data;
    } catch (err) {
      if (uploadedKey) await rollbackS3Upload(uploadedKey);
      throw err;
    }
  },
  /**
   * Delete a service by ID.
   * @param {number|string} id - Service ID to delete
   * @returns {Promise<void>}
   */
  deleteService: async (id) => {
    await api.delete(`/service/${id}`);
  },
};