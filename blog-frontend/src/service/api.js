const axios = require('axios');

const api = axios.create({
  baseURL: 'http://localhost:5500/',
  headers: {
    Accept: 'application/json',
  },
});

module.exports = api;
