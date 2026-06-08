import api from "../../lib/axios";

export const serviceApi = {
    getAllServices: () => api.get("/service/list"),
    createService: (serviceData) => api.post("/service/create", serviceData),
    getServiceById: (serviceId) => api.get(`/service/${serviceId}`),
    updateService: (serviceId, serviceData) => api.put(`/service/${serviceId}`, serviceData),
    deleteService: (serviceId) => api.delete(`/service/${serviceId}`),
};