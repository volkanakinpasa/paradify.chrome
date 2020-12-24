import '../img/16.png';
import '../img/48.png';
import '../img/128.png';

const addIconClicked = (data) => {
  const { eventCategory, eventAction, eventLabel } = data;
  // Standard Google Universal Analytics code
  // noinspection OverlyComplexFunctionJS
  (function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r;
    // noinspection CommaExpressionJS
    (i[r] =
      i[r] ||
      function () {
        (i[r].q = i[r].q || []).push(arguments);
      }),
      (i[r].l = 1 * new Date());
    // noinspection CommaExpressionJS
    (a = s.createElement(o)), (m = s.getElementsByTagName(o)[0]);
    a.async = 1;
    a.src = g;
    m.parentNode.insertBefore(a, m);
  })(
    window,
    document,
    'script',
    'https://www.google-analytics.com/analytics.js',
    'ga',
  );
  // eslint-disable-next-line no-undef
  ga('create', 'UA-3218083-16', 'auto');
  // see: http://stackoverflow.com/a/22152353/1958200
  // eslint-disable-next-line no-undef
  ga('set', 'anonymizeIp', true);
  // eslint-disable-next-line no-undef
  ga('set', 'checkProtocolTask', function () {});
  // eslint-disable-next-line no-undef
  ga('send', {
    hitType: 'event',
    eventCategory,
    eventAction,
    eventLabel,
  });
};

const onTokenCompleted = (token) => {
  // eslint-disable-next-line no-undef
  chrome.storage.sync.set({ token: token });
};

function setBadgeText(text) {
  // eslint-disable-next-line no-undef
  chrome.browserAction.setBadgeText({ text });
  setTimeout(() => clearBadge(), 5000);
}

function clearBadge() {
  // eslint-disable-next-line no-undef
  chrome.browserAction.setBadgeText({ text: '' });
}

const messageListener = (message, serder, callback) => {
  switch (message.type) {
    case 'onPopupOpened':
      break;
    case 'clearBadge':
      clearBadge();
      callback('OK');
      break;
    case 'setBadgeText':
      setBadgeText(message.data);
      callback('OK');
      break;
    case 'onTokenCompleted':
      onTokenCompleted(message.data.token, callback);
      break;
    case 'addIconClicked':
      addIconClicked(message.data);
      callback('OK');
      break;
  }
};
// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  messageListener(message, sender, sendResponse);
});
// eslint-disable-next-line no-undef
chrome.runtime.onMessageExternal.addListener(function (message, sender) {
  messageListener(message, sender, () => {});
});

// eslint-disable-next-line no-undef
chrome.runtime.setUninstallURL(
  'http://www.paradify.com/home/UnInstalled',
  () => {},
);

var div = document.createElement('div');
div.cssText =
  'position: absolute: width: 200px; height: 200px; z-index: 99999; right: 0; top: 0';
div.innerText = 'PARADIFY';
document.body.appendChild(div);
