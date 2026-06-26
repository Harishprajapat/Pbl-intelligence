import api from "./client";

export const listGrants = () => api.get("/grants").then(r => r.data);
export const getGrantMonths = (grantId) => api.get(`/grants/${grantId}/months`).then(r => r.data);
export const getGrantReport = (grantId, month) => api.get(`/grants/${grantId}/report`, { params: { month } }).then(r => r.data);
export const generateNarrative = (grantId, month, aiEnabled) =>
  api.post(`/grants/${grantId}/narrative`, { month, aiEnabled }).then(r => r.data);