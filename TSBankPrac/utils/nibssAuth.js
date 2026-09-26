const axios = require('axios');
const { ApiTokenCache } = require('../Models/Api');

const NIBSS_BASE_URL =
  process.env.NIBSS_API_URL || 'https://nibssbyphoenix.onrender.com/api';

const EXPIRY_BUFFER_MS = 60 * 1000;

async function fetchNewToken() {
  const response = await axios.post(
    `${NIBSS_BASE_URL}/auth/token`,
    {
      apiKey: process.env.NIBSS_API_KEY,
      apiSecret: process.env.NIBSS_API_SECRET
    },
    {
      timeout: 15000,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );

  const token = response.data?.token;

  if (!token) {
    throw new Error('NIBSS response did not contain a token');
  }

  const expiresInSeconds = Number(response.data?.expiresIn || 3600);

  await ApiTokenCache.deleteMany({});
  await ApiTokenCache.create({
    token,
    expiresAt: new Date(Date.now() + expiresInSeconds * 1000)
  });

  return token;
}

async function getValidToken() {
  const cached = await ApiTokenCache.findOne().sort({ createdAt: -1 });

  if (cached && cached.expiresAt.getTime() - EXPIRY_BUFFER_MS > Date.now()) {
    return cached.token;
  }

  return fetchNewToken();
}

module.exports = { getValidToken };
