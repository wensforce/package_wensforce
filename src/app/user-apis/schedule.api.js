import api from "../axios/axios";

export const scheduleApiUser = {
  create: async (payload) => {
    const res = await api.post("/schedule", payload);
    return res.data;
  },
};
