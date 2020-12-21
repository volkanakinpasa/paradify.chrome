const getSearchTextFromTrackInfo = (trackInfo) => {
  let q = '';
  if (trackInfo) {
    q =
      trackInfo.trackName +
      ' ' +
      (trackInfo.artistName ? trackInfo.artistName : '');
  }

  return q.trim();
};

const initializeReactGA = (ReactGA, pageName) => {
  ReactGA.initialize('UA-3218083-16');
  ReactGA.set({ anonymizeIp: true });
  ReactGA.set({ checkProtocolTask: () => {} });
  ReactGA.pageview('/' + pageName);

  ReactGA.event({
    category: 'On Site',
    action: 'Page Load',
  });
};

var defaults = {
  url: 'http://www.paradify.com/',
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

String.format = function () {
  var s = arguments[0];

  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp('\\{' + i + '\\}', 'gm');
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
};

function getPageName(url) {
  var pageName;
  if (url.indexOf('powerapp') > -1) {
    pageName = 'powerapp';
  } else if (url.indexOf('youtube.com/watch') > -1) {
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
function readNowPlayingText(pageName) {
  if (pageName == 'powerapp') {
    return readPowerfm();
  } else if (pageName == 'youtube') {
    return readYoutube();
  } else if (pageName == 'karnaval') {
    return readKarnaval();
  } else if (pageName == 'soundcloud') {
    return readsoundCloud();
  } else if (pageName == 'vimeo') {
    return readVimeo();
  } else if (pageName == 'dailymotion') {
    return readDailyMotion();
  } else if (pageName == 'kralmuzik') {
    return readKralmuzik();
  } else if (pageName == 'tunein') {
    return readTunein();
  } else if (pageName == 'deezer') {
    return readDeezer();
  } else if (pageName == 'radioswissjazz') {
    return readRadioswissjazz();
  } else if (pageName == 'spotify') {
    return readSpotify();
  } else if (pageName == 'beatport') {
    return readBeatport();
  } else {
    return null;
  }
}

function readPowerfm() {
  var track = document.getElementsByClassName('artistSongTitle')[0].innerText;

  var artist = document.getElementsByClassName('artistTitle')[0].innerText;

  var result = { track: track, artist: artist };
  return result;
}

function readYoutube() {
  var track = document.title.trim().replace(' - YouTube', '');
  var result = { track: track };
  return result;
}

function readKarnaval() {
  var title = document.getElementsByClassName('title')[0];
  var track = title.firstChild.firstChild.innerText;

  var artist = document.getElementsByClassName('sub_title')[0].firstChild
    .firstChild.innerText;

  var result = { track: track, artist: artist };

  return result;
}

function readsoundCloud() {
  var track = document
    .getElementsByClassName('playbackSoundBadge__titleLink sc-truncate')[0]
    .getAttribute('title');

  var artist = document
    .getElementsByClassName(
      'playbackSoundBadge__lightLink sc-link-light sc-truncate',
    )[0]
    .getAttribute('title');
  var result;
  if (track != '') {
    result = { track: track, artist: artist };
  }
  return result;
}

function readVimeo() {
  var track = document.title.trim().replace('on Vimeo', '');
  var result;
  if (track != '') {
    result = { track: track, artist: '' };
  }
  return result;
}
function readDailyMotion() {
  var track = document.querySelector('[class^="VideoInfoTitle__videoTitle"]')
    .innerText;
  var result;
  if (track != '') {
    result = { track: track, artist: '' };
  }
  return result;
}

function readKralmuzik() {
  var currentSongDiv = document.getElementsByClassName('live-info')[0];
  var track = currentSongDiv.getElementsByTagName('h2')[0].innerText;

  var artist = currentSongDiv.getElementsByTagName('h1')[0].innerText;
  var result = { track: track, artist: artist };
  return result;
}

function readTunein() {
  var track = document.getElementById('playerTitle').innerHTML;

  var result = { track: track };

  return result;
}

function readDeezer() {
  var track = document.getElementsByClassName('marquee-wrapper')[0].innerText;
  track = track.replace(' . ', ' - ');
  var result = { track: track, artist: '' };

  return result;
}

function readRadioswissjazz() {
  var track = document
    .getElementsByClassName('current-airplay')[0]
    .getElementsByClassName('titletag')[0].innerHTML;

  var artist = document
    .getElementsByClassName('current-airplay')[0]
    .getElementsByClassName('artist')[0].innerHTML;

  var result = { track: track, artist: artist };

  return result;
}

function readSpotify() {
  var track = document
    .getElementsByClassName('track-info__name ellipsis-one-line')[0]
    .getElementsByTagName('a')[0].innerHTML;

  var artist = document
    .getElementsByClassName('track-info__artists')[0]
    .getElementsByTagName('a')[0].innerHTML;

  var result = { track: track, artist: artist };

  return result;
}

function readBeatport() {
  var track = document.getElementsByClassName('track-title__primary')[0]
    .innerHTML;

  var artist = document.getElementsByClassName('track-artists__artist')[0]
    .innerHTML;

  var result = { track: track, artist: artist };

  return result;
}

var paradify = {
  pageLoad: function () {
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({ type: 'clearBadge' });
    var url = window.location.href.toLowerCase();

    var trackInfo = paradify.getTrackInfo(url);
    if (trackInfo != undefined && trackInfo.success) {
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ type: 'setBadgeText', data: ' 1 ' });
    }
  },

  getTrackInfo: function (url) {
    var response = {};
    try {
      var pageName = getPageName(url);
      var playingResult = readNowPlayingText(pageName);

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

  contextMenuClicked: function (text) {
    var url = String.format(
      '{0}{1}?q={2}',
      defaults.url,
      defaults.searchPath,
      text,
    );

    return url;
  },
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

const filterQuery = (query) => {
  wordsToRemove.forEach((value) => {
    query = query.toLowerCase().replace(value, ' ');
  });

  query = query.replace(/(\(|\[)[^\]]*(\)|\])/g, '');
  console.log(query);

  return query;
};

const getSpotifySearchUrl = (query) => {
  return `https://open.spotify.com/search/${filterQuery(query)}`;
};

const contentSpotifyAddButtonStyle = {
  padding: '0',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
};
const contentContainernStyle = {
  padding: '20%',
};

const imageSpotifyAddButtonStyle = {
  height: '100%',
  top: '0px',
  bottom: '0px',
  display: 'block',
  margin: 'auto',
  width: '100%',
};

export {
  initializeReactGA,
  getSearchTextFromTrackInfo,
  paradify,
  getSpotifySearchUrl,
  contentSpotifyAddButtonStyle,
  imageSpotifyAddButtonStyle,
  contentContainernStyle,
};
