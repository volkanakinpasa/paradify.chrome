import path from 'path';

const URLS = {
  BASE_URL: process.env.BASEURL || 'https://localhost:5001',
  REDIRECT_AUTH_PATH: '/api/redirect_auth',
  SEARCH_PATH: '/api/search',
  ME_PATH: '/api/me',
  PLAYLIST_PATH: '/api/playlist',
  REFRESH_PATH: '/api/refresh-token',
};

const getRedirectAuthUrl = () => {
  return path.join(URLS.BASE_URL, URLS.REDIRECT_AUTH_PATH);
};

const getSearchUrl = () => {
  return path.join(URLS.BASE_URL, URLS.SEARCH_PATH);
};

const getMeUrl = () => {
  return path.join(URLS.BASE_URL, URLS.ME_PATH);
};

const getPlaylistrl = () => {
  return path.join(URLS.BASE_URL, URLS.PLAYLIST_PATH);
};

const getRefreshUrl = () => {
  return path.join(URLS.BASE_URL, URLS.REFRESH_PATH);
};

export {
  getRedirectAuthUrl,
  getSearchUrl,
  getMeUrl,
  getPlaylistrl,
  getRefreshUrl,
};
