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
    'ga'
  );
  ga('create', 'UA-3218083-16', 'auto');
  // see: http://stackoverflow.com/a/22152353/1958200
  ga('set', 'checkProtocolTask', function () {});
  ga('send', {
    hitType: 'event',
    eventCategory,
    eventAction,
    eventLabel,
  });
};

const onTokenCompleted = (token) => {
  chrome.storage.sync.set({ token: token });
};

function setBadgeText(text) {
  chrome.browserAction.setBadgeText({ text });
  setTimeout(() => clearBadge(), 5000);
}

function clearBadge() {
  chrome.browserAction.setBadgeText({ text: '' });
}

const messageListener = (message, serder, callback) => {
  switch (message.type) {
    case 'onPopupOpened':
      console.log(message.data);
      break;
    case 'clearBadge':
      clearBadge();
      callback('OK');
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
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  messageListener(message, sender, sendResponse);
});

chrome.runtime.onMessageExternal.addListener(function (message, sender) {
  messageListener(message, sender, () => {});
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason == 'install') {
    chrome.tabs.create({
      url: 'http://www.paradify.com/home/Installed',
    });
  }
});

chrome.runtime.setUninstallURL(
  'http://www.paradify.com/home/UnInstalled',
  () => {}
);

var div = document.createElement('div');
div.cssText =
  'position: absolute: width: 200px; height: 200px; z-index: 99999; right: 0; top: 0';
div.innerText = 'PARADIFY';
document.body.appendChild(div);
