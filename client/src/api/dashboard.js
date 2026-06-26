import api from "./client";

export const getFilters = (params) => api.get("/dashboard/filters", { params }).then(r => r.data);
export const getSummary = (params) => api.get("/dashboard/summary", { params }).then(r => r.data);
export const getTrend = (params) => api.get("/dashboard/trend", { params }).then(r => r.data);
export const getGeography = (params) => api.get("/dashboard/geography", { params }).then(r => r.data);