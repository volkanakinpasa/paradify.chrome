import '../img/16.png';
import '../img/48.png';
import '../img/128.png';

const onTokenCompleted = (token, callback) => {
  const { access_token, refresh_token } = token;

  chrome.storage.sync.set({ token: token }, () => callback({ message: 'ok' }));
};

function setBadgeText(text) {
  chrome.browserAction.setBadgeText({ text: 'Hey' });
  chrome.browserAction.setBadgeBackgroundColor({ color: '#FF55A9' });

  var intervalID = setInterval(function () {
    chrome.browserAction.setBadgeText({ text: text });
    window.clearInterval(intervalID);
  }, 2000);
}

function clearBadge() {
  chrome.browserAction.setBadgeText({ text: '' });
}

const messageListener = (message, serder, callback) => {
  switch (message.type) {
    case 'onPopupOpened':
      console.log('popup clicked');
      console.log(message.data);
      break;
    case 'clearBadge':
      clearBadge();
      callback('OK');
      break;
    case 'onTokenCompleted':
      console.log('onTokenCompleted');
      console.log(message.data);
      onTokenCompleted(message.data.token, callback);
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
