import ParadifySpotifyAddContainer from './Content/ParadifySpotifyAddContainer.jsx';
import React from 'react';
import { render } from 'react-dom';
import { paradify } from './utils';

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message != undefined) {
    if (message.type == 'getTrackInfo') {
      var trackInfo = paradify.getTrackInfo(message.url);
      sendResponse(trackInfo);
    } else if (message.type == 'contextMenuClicked') {
      var returnUrl = paradify.contextMenuClicked(
        message.details.selectionText
      );
      sendResponse(returnUrl);
    }
  }
});

const injectParadifyAddContainer = () => {
  const paradifySpotifyAddContainer = window.document.createElement('div');
  paradifySpotifyAddContainer.id = 'paradify-spotify-add-container';

  try {
    paradifySpotifyAddContainer.style.cssText =
      'width: 30px; position: absolute; top: 8px;left: -32px;';
    const menuContainer = window.document.getElementById('menu-container');
    menuContainer.appendChild(paradifySpotifyAddContainer);

    render(
      <ParadifySpotifyAddContainer />,
      window.document.getElementById('paradify-spotify-add-container')
    );
  } catch {
    // paradifySpotifyAddContainer.style.cssText =
    //   'opacity: 1; right: 10px !important; position: fixed !important; bottom: 50px !important; margin: 5px; background-color: transparent;';
    // render(
    //   <ParadifySpotifyAbsoluteContainer query={q} />,
    //   window.document.getElementById('paradify-spotify-add-container')
    // );
    // document.body.appendChild(paradifySpotifyAddContainer);
  }
};

const loadInjection = () => {
  injectParadifyAddContainer();
};

const onLoad = () => {
  paradify.pageLoad();

  setTimeout(() => {
    loadInjection();
  }, 2000);
};

window.addEventListener('load', onLoad, false);
