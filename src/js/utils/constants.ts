const URLS = {
  BASE_URL:
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? 'https://www.paradify.com'
      : 'http://localhost:8080',
  REDIRECT_AUTH_PATH: 'api/redirect_auth',
  SEARCH_PATH: 'api/search',
  ME_PATH: 'api/me',
  PLAYLIST_PATH: 'api/playlist',
  REFRESH_PATH: 'api/refresh-token',
};

const getRedirectAuthUrl = () => `${URLS.BASE_URL}/${URLS.REDIRECT_AUTH_PATH}`;

const getSearchUrl = () => `${URLS.BASE_URL}/${URLS.SEARCH_PATH}`;

const getMeUrl = () => `${URLS.BASE_URL}/${URLS.ME_PATH}`;

const getPlaylistUrl = () => `${URLS.BASE_URL}/${URLS.PLAYLIST_PATH}`;

const getRefreshUrl = () => `${URLS.BASE_URL}/${URLS.REFRESH_PATH}`;

const supportedWebsite = {
  href: 'https://www.youtube.com/',
  name: 'YouTube',
};

const TIMEOUT_MS = 9000;

const SPOTIFY_ICON_CLICK_ACTION_OPTION = 'SPOTIFY_ICON_CLICK_ACTION_OPTION';
const SPOTIFY_TOKEN = 'SPOTIFY_TOKEN';
const DEPLOYMENT_1 = 'DEPLOYMENT_1';
const EXTENSION_INSTALLED = 'EXTENSION_INSTALLED';

export {
  getRedirectAuthUrl,
  getSearchUrl,
  getMeUrl,
  getPlaylistUrl,
  getRefreshUrl,
  supportedWebsite,
  TIMEOUT_MS,
  SPOTIFY_ICON_CLICK_ACTION_OPTION,
  SPOTIFY_TOKEN,
  DEPLOYMENT_1,
  EXTENSION_INSTALLED,
  URLS,
};
