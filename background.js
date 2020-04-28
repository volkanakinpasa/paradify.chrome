if (!localStorage.getItem("install_time")) {
  var now = new Date().getTime();
  localStorage.setItem("install_time", now);
  chrome.tabs.create({
    url: "https://paradify-web.azurewebsites.net/home/Installed",
  });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  switch (message.type) {
    case "setBadgeText":
      setBadgeText(message.text);
      break;
    case "clearBadge":
      clearBadge();
      break;
  }
});

function setBadgeText(text) {
  chrome.browserAction.setBadgeText({ text: "Hey" });
  chrome.browserAction.setBadgeBackgroundColor({ color: "#FF55A9" });

  var intervalID = setInterval(function () {
    chrome.browserAction.setBadgeText({ text: text });
    window.clearInterval(intervalID);
  }, 2000);
}

function clearBadge() {
  chrome.browserAction.setBadgeText({ text: "" });
}

//When the page is loaded on youtube, this will let content.js know to show a notification.
chrome.webNavigation.onCompleted.addListener(function (details) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length == 0) return;

    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "backgroundStarts", details: details },
      function (response) {}
    );
  });
});

function contextMenuClicked(details) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (tabs.length == 0) return;

    chrome.tabs.sendMessage(
      tabs[0].id,
      { type: "contextMenuClicked", details: details },
      function (returnUrl) {
        chrome.tabs.create({ url: returnUrl });
      }
    );
  });
}

chrome.contextMenus.create({
  title: "Add to Spotify Playlist",
  contexts: ["selection"],
  onclick: contextMenuClicked,
});

function getQueryStringValue(url, key) {
  return decodeURIComponent(
    url.replace(
      new RegExp(
        "^(?:.*[&\\?]" +
          encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") +
          "(?:\\=([^&]*))?)?.*$",
        "i"
      ),
      "$1"
    )
  );
}
