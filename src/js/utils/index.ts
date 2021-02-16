import contentUtil from './contentUtil';
import storageUtil from './storageUtil';
import { ENVIRONMENTS } from './constants';

const initializeReactGA = (ReactGA: any, pageName: string) => {
  if (process.env.NODE_ENV !== ENVIRONMENTS.PRODUCTION) return;

  ReactGA.initialize('UA-3218083-16');
  ReactGA.set({ anonymizeIp: true });
  ReactGA.set({ checkProtocolTask: () => {} });
  ReactGA.pageview('/' + pageName);

  ReactGA.event({
    category: 'On Site',
    action: `${pageName} page load`,
  });
};

function getPageName(url: string): string {
  let pageName = '';
  if (
    url.indexOf('youtube.com/watch') > -1 ||
    url.indexOf('chrome-extension://') > -1
  ) {
    pageName = 'youtube';
  }

  return pageName;
}

function readNowPlayingText(pageName: string) {
  if (pageName == 'youtube') {
    return readYoutube();
  } else {
    return null;
  }
}

function readYoutube() {
  const track = document.title.trim().replace(' - YouTube', '');
  const result = { track: track };
  return result;
}

const paradify = {
  pageLoad: () => {
    chrome.runtime.sendMessage({ type: 'clearBadge' });

    const trackInfo = paradify.getTrackInfo(window.location.href.toLowerCase());

    if (trackInfo != undefined && trackInfo.success) {
      chrome.runtime.sendMessage({ type: 'setBadgeText', data: ' 1 ' });
    }
  },

  getTrackInfo: function (url: string): any {
    const response: any = {};
    const pageName: string = getPageName(url);
    try {
      const playingResult: any = readNowPlayingText(pageName);

      if (playingResult != null) {
        response.track = {
          trackName: playingResult.track,
          artist: playingResult.artist,
        };
        response.success = true;
      } else {
        response.success = false;
        response.errMessage = 'No track info';
      }
    } catch (err) {
      response.success = false;
      response.errMessage = err.message;
    }

    response.pageName = pageName;

    return response;
  },
};

const getSearchTextFromTrackInfo = (trackInfo: any): string => {
  let q = '';
  if (trackInfo) {
    q =
      trackInfo.trackName +
      ' ' +
      (trackInfo.artistName ? trackInfo.artistName : '');
  }

  return q.trim();
};

const wordsToRemove = [
  ' feat ',
  ' feat. ',
  ' ft ',
  ' ft. ',
  '&',
  ' x ',
  ' - ',
  '?',
  '|',
  '!',
];

const filterQuery = (query: string): string => {
  wordsToRemove.forEach((value) => {
    query = query.toLowerCase().replace(value, ' ');
  });

  query = query.replace(/(\(|\[)[^\]]*(\)|\])/g, '');

  return query;
};

const getSpotifySearchUrl = (query: any): string => {
  return `https://open.spotify.com/search/${filterQuery(query)}`;
};

const getRandomSuccessGif = (): string => {
  const images = [
    'https://media.giphy.com/media/2U0MJobOh2sta/giphy.gif',
    'https://media.giphy.com/media/fxsqOYnIMEefC/giphy.gif',
    'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const getRandomFailedGif = (): string => {
  const images = [
    'https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif',
    'https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif',
    'https://media.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif',
    'https://media.giphy.com/media/3ohs7KViF6rA4aan5u/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const getRandomInstalledGif = (): string => {
  const images = [
    'https://media.giphy.com/media/lMameLIF8voLu8HxWV/giphy.gif',
    'https://media.giphy.com/media/l0IygWpszunxnkMAo/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const getRandomErrorGif = (): string => {
  const images = [
    'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif',
    'https://media.giphy.com/media/GoHD0xCYwjM5y/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const getRandomDonationGif = (): string => {
  const images = [
    'https://media.giphy.com/media/iFyQMfqxYFhO2b4o3T/giphy.gif',
    'https://media.giphy.com/media/l1KdaNvn6cDYMX3PO/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

export {
  initializeReactGA,
  getSearchTextFromTrackInfo,
  paradify,
  getSpotifySearchUrl,
  contentUtil,
  storageUtil,
  getRandomSuccessGif,
  getRandomFailedGif,
  getRandomInstalledGif,
  getRandomErrorGif,
  getRandomDonationGif,
};
