import '../img/16.png';
import '../img/48.png';
import '../img/128.png';

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

chrome.runtime.setUninstallURL('https://forms.gle/bBaMUH2m16VH3o3J6', () => {});

var div = document.createElement('div');
div.cssText =
  'position: absolute: width: 200px; height: 200px; z-index: 99999; right: 0; top: 0';
div.innerText = 'PARADIFY';
document.body.appendChild(div);
