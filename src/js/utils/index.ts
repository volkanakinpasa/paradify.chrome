import contentUtil from './contentUtil';
import storageUtil from './storageUtil';

const initializeReactGA = (ReactGA: any, pageName: string) => {
  ReactGA.initialize('UA-3218083-16');
  ReactGA.set({ anonymizeIp: true });
  ReactGA.set({ checkProtocolTask: () => {} });
  ReactGA.pageview('/' + pageName);

  ReactGA.event({
    category: 'On Site',
    action: `${pageName} page load`,
  });
};

const defaults = {
  url: 'https://www.paradify.com/',
  searchJsonPath: 'searchJson',
  searchPath: 'searchp',
  searchBoxClass: '.searchBox',
  clickButtonClass: '.clickButton',
  query: '#q',
  result: 'result',
  resultId: '#result',
  formId: '#form',
  waitingId: '#waiting',
  events: { ENTER: 13 },
  test: '2',
};

function getPageName(url: string): string {
  let pageName = '';
  if (url.indexOf('powerapp') > -1) {
    pageName = 'powerapp';
  } else if (
    url.indexOf('youtube.com/watch') > -1 ||
    url.indexOf('chrome-extension://') > -1
  ) {
    pageName = 'youtube';
  } else if (url.indexOf('karnaval.com') > -1) {
    pageName = 'karnaval';
  } else if (url.indexOf('soundcloud.com') > -1) {
    pageName = 'soundcloud';
  } else if (url.indexOf('vimeo.com') > -1) {
    pageName = 'vimeo';
  } else if (url.indexOf('dailymotion.com') > -1) {
    pageName = 'dailymotion';
  } else if (url.indexOf('kralmuzik.com.tr') > -1) {
    pageName = 'kralmuzik';
  } else if (url.indexOf('tunein.com') > -1) {
    pageName = 'tunein';
  } else if (url.indexOf('deezer') > -1) {
    pageName = 'deezer';
  } else if (url.indexOf('radioswissjazz') > -1) {
    pageName = 'radioswissjazz';
  } else if (url.indexOf('open.spotify') > -1) {
    pageName = 'spotify';
  } else if (url.indexOf('beatport.com') > -1) {
    pageName = 'beatport';
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

  contextMenuClicked: function (text: string) {
    return `${defaults.url}${defaults.searchPath}?q=${text}`;
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

const filterQuery = (query: any) => {
  wordsToRemove.forEach((value) => {
    query = query.toLowerCase().replace(value, ' ');
  });

  query = query.replace(/(\(|\[)[^\]]*(\)|\])/g, '');

  return query;
};

const getSpotifySearchUrl = (query: any) => {
  return `https://open.spotify.com/search/${filterQuery(query)}`;
};

const getRandomSuccessGif = () => {
  const images = [
    'https://media.giphy.com/media/2U0MJobOh2sta/giphy.gif',
    'https://media.giphy.com/media/fxsqOYnIMEefC/giphy.gif',
    'https://media.giphy.com/media/26u4lOMA8JKSnL9Uk/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};
const getRandomFailedGif = () => {
  const images = [
    'https://media.giphy.com/media/14uQ3cOFteDaU/giphy.gif',
    'https://media.giphy.com/media/26n6WywJyh39n1pBu/giphy.gif',
    'https://media.giphy.com/media/l2JehQ2GitHGdVG9y/giphy.gif',
    'https://media.giphy.com/media/3ohs7KViF6rA4aan5u/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const getRandomInstalledGif = () => {
  const images = [
    'https://media.giphy.com/media/lMameLIF8voLu8HxWV/giphy.gif',
    'https://media.giphy.com/media/l0IygWpszunxnkMAo/giphy.gif',
  ];
  const index = Math.floor(Math.random() * images.length);
  return images[index];
};

const getRandomErrorGif = () => {
  const images = [
    'https://media.giphy.com/media/TqiwHbFBaZ4ti/giphy.gif',
    'https://media.giphy.com/media/GoHD0xCYwjM5y/giphy.gif',
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
};
