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
};

String.format = function () {
  var s = arguments[0];

  for (var i = 0; i < arguments.length - 1; i++) {
    var reg = new RegExp('\\{' + i + '\\}', 'gm');
    s = s.replace(reg, arguments[i + 1]);
  }

  return s;
};

function readNowPlayingText(pageName) {
  if (
    pageName == 'radioparadise' &&
    window.getSelection().toString().trim() != ''
  ) {
    var result = { track: window.getSelection().toString().trim(), artist: '' };
    return result;
  } else if (pageName == 'radioparadise') {
    return readRadioParadise();
  } else if (pageName == 'powerapp') {
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
  } else if (pageName == 'jango') {
    return readJango();
  } else if (pageName == 'qmusic') {
    return readQMusic();
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

// function readRadioParadise() {
//   var iframe = document.getElementById('content');
//   if (iframe != undefined) {
//     var innerDoc = iframe.contentDocument
//       ? iframe.contentDocument
//       : iframe.contentWindow.document;
//     var c = innerDoc.getElementsByClassName('song_title');
//     var data = c[3].innerText;
//     var arr = data.split('—');
//     var result = {
//       track: arr[0].replace(/^\s*|\s*$/g, ''),
//       artist: arr[1].replace(/^\s*|\s*$/g, ''),
//     };
//     return result;
//   }
//   return null;
// }

// function readPowerfm() {
//   var currentSongDiv = document.getElementsByClassName('artistSongTitle')[0]
//     .innerText;
//   var track = currentSongDiv;

//   var currentSongDiv = document.getElementsByClassName('artistTitle')[0]
//     .innerText;
//   var artist = currentSongDiv;

//   var result = { track: track, artist: artist };
//   return result;
// }

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
      'playbackSoundBadge__lightLink sc-link-light sc-truncate'
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
  var track = document.getElementsByClassName(
    'QueueInfoContent__title___2Gvkw'
  )[0].innerHTML;
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

  radio - stream - next - song;

  var result = { track: track, artist: artist };

  return result;
}

function readTunein() {
  var track = document.getElementById('playerTitle').innerHTML;

  var result = { track: track };

  return result;
}

function readJango() {
  var track = document.getElementById('current-song').innerHTML;
  var artist = document
    .getElementById('player_current_artist')
    .getElementsByTagName('a')[0].innerText;
  var result = { track: track, artist: artist };
  return result;
}

function readQMusic() {
  var track = document
    .getElementsByClassName('current-track')[0]
    .getElementsByClassName('title')[0].innerHTML;

  var artist = document
    .getElementsByClassName('current-track')[0]
    .getElementsByClassName('artist')[0].innerHTML;

  var result = { track: track, artist: artist };

  return result;
}
function readDeezer() {
  var track = document
    .getElementsByClassName('player-track-title')[0]
    .getElementsByClassName('player-track-link')[0].innerHTML;

  var artist = document
    .getElementsByClassName('player-track-artist')[0]
    .getElementsByClassName('player-track-link')[0].innerHTML;

  var result = { track: track, artist: artist };

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
    chrome.runtime.sendMessage({ type: 'clearBadge' });
    var url = window.location.href.toLowerCase();
    var pageName = getPageName(url);
    if (pageName != undefined) {
      var trackInfo = paradify.getTrackInfo(pageName);
      if (trackInfo != undefined && trackInfo.success) {
        chrome.runtime.sendMessage({ type: 'setBadgeText', text: ' 1 ' });
      }
    }
  },

  getTrackInfo: function (pageName) {
    var response = {};
    try {
      var playingResult = readNowPlayingText(pageName);

      if (playingResult != null) {
        response.track = {
          trackName: playingResult.track,
          artist: playingResult.artist,
        };
        response.success = true;
      } else {
        response.success = false;
        response.errMessage = 'There is no playing song on this page';
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
      text
    );

    return url;
  },
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message != undefined) {
    if (
      message.type == 'backgroundStarts' &&
      message.details != undefined &&
      message.details.url == window.location.href
    ) {
      paradify.pageLoad();
    } else if (message.type == 'getTrackInfo') {
      var trackInfo = paradify.getTrackInfo(message.pageName);
      sendResponse(trackInfo);
    } else if (message.type == 'contextMenuClicked') {
      var returnUrl = paradify.contextMenuClicked(
        message.details.selectionText
      );
      sendResponse(returnUrl);
    }
  }
});
