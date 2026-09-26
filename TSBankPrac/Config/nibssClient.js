const axios = require('axios');
const { getValidToken } = require('../utils/nibssAuth');

const NIBSS_BASE_URL =
  process.env.NIBSS_API_URL || 'https://nibssbyphoenix.onrender.com/api';

const nibssClient = axios.create({
  baseURL: NIBSS_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json'
  }
});

nibssClient.interceptors.request.use(async (config) => {
  // Never attach a cached token to the token endpoint itself.
  if (!config.url?.includes('/auth/token')) {
    const token = await getValidToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

module.exports = nibssClient;
