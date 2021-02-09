import { ENVIRONMENTS, DOMAINS } from '../../../utils';

const URLS = {
  BASE_URL:
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === 'production'
      ? `https://www.${DOMAINS.PRODUCTION}`
      : `http://${DOMAINS.DEVELOPMENT}`,
  REDIRECT_AUTH_PATH: 'api/redirect_auth',
  SEARCH_PATH: 'api/search',
  ME_PATH: 'api/me',
  ADD_TRACK_PATH: 'api/track',
  ADD_TRACKS_PATH: 'api/tracks',
  REFRESH_PATH: 'api/refresh-token',
};

const getRedirectAuthUrl = (): string =>
  `${URLS.BASE_URL}/${URLS.REDIRECT_AUTH_PATH}`;

const getSearchUrl = (): string => `${URLS.BASE_URL}/${URLS.SEARCH_PATH}`;

const getMeUrl = (): string => `${URLS.BASE_URL}/${URLS.ME_PATH}`;

const getAddTrackUrl = (): string => `${URLS.BASE_URL}/${URLS.ADD_TRACK_PATH}`;
const getAddTracksUrl = (): string =>
  `${URLS.BASE_URL}/${URLS.ADD_TRACKS_PATH}`;

const getRefreshUrl = (): string => `${URLS.BASE_URL}/${URLS.REFRESH_PATH}`;

const supportedWebsite = {
  href: 'https://www.youtube.com/',
  name: 'YouTube',
};

const TIMEOUT_MS = 9000;

const SPOTIFY_ICON_CLICK_ACTION_OPTION = 'SPOTIFY_ICON_CLICK_ACTION_OPTION';
const SPOTIFY_TOKEN = 'SPOTIFY_TOKEN';
const DEPLOYMENT_VERSION = 'DEPLOYMENT_7.1.0';
const EXTENSION_INSTALLED = 'EXTENSION_INSTALLED';

export {
  getRedirectAuthUrl,
  getSearchUrl,
  getMeUrl,
  getAddTrackUrl,
  getAddTracksUrl,
  getRefreshUrl,
  supportedWebsite,
  TIMEOUT_MS,
  SPOTIFY_ICON_CLICK_ACTION_OPTION,
  SPOTIFY_TOKEN,
  DEPLOYMENT_VERSION,
  EXTENSION_INSTALLED,
  URLS,
  ENVIRONMENTS,
  DOMAINS,
};
