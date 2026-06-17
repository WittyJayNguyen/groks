export const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:18081";

export const API_ENDPOINTS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    forgotPassword: "/api/auth/forgot-password",
    resetPassword: "/api/auth/reset-password",
    logout: "/api/auth/logout",
    switchOrganization: "/api/auth/switch-organization",
    me: "/api/me",
  },
  pools: {
    list: "/api/pools",
    create: "/api/pools",
    update: (poolId) => `/api/pools/${poolId}`,
    delete: (poolId) => `/api/pools/${poolId}`,
  },
  apiKeys: {
    list: "/api/api-keys",
    create: "/api/api-keys",
    revoke: (keyId) => `/api/api-keys/${keyId}`,
  },
  jobs: {
    list: "/api/jobs",
    create: "/api/jobs",
    logs: (jobId) => `/api/jobs/${jobId}/logs`,
  },
  logs: {
    list: "/api/logs",
  },
  client: {
    verify: "/api/client/verify",
    chat: "/api/client/chat",
    generate: "/api/client/generate",
    status: (taskId) => `/api/client/tasks/${taskId}/status`,
    file: (fileId) => `/api/files/${fileId}`,
  },
};
