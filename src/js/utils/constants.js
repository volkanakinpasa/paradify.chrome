import path from 'path';

const URLS = {
  BASE_URL:
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? 'http://www.paradify.com'
      : 'https://localhost:5001',
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

const getPlaylistUrl = () => {
  return path.join(URLS.BASE_URL, URLS.PLAYLIST_PATH);
};

const getRefreshUrl = () => {
  return path.join(URLS.BASE_URL, URLS.REFRESH_PATH);
};

const supportedWebsite = {
  href: 'https://www.youtube.com/',
  name: 'YouTube',
};

export {
  getRedirectAuthUrl,
  getSearchUrl,
  getMeUrl,
  getPlaylistUrl,
  getRefreshUrl,
  supportedWebsite,
};
