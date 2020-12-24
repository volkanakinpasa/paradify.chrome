/* eslint-disable prefer-arrow-callback */
/* eslint-disable react/jsx-filename-extension */
// import ParadifySpotifyAddContainer from './Content/ParadifySpotifyAddContainer.jsx';
import React from 'react';
import { render } from 'react-dom';
import SpotifyIconInYouTube from './SpotifyIconInYouTube.jsx';
import { paradify, contentUtil } from '../utils';

// eslint-disable-next-line no-undef
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message != undefined) {
    if (message.type == 'getTrackInfo') {
      var trackInfo = paradify.getTrackInfo(message.url);
      sendResponse(trackInfo);
    } else if (message.type == 'contextMenuClicked') {
      var returnUrl = paradify.contextMenuClicked(
        message.details.selectionText,
      );
      sendResponse(returnUrl);
    }
  }
});

const injectParadifyAddContainer = () => {
  const containerName = 'paradify-spotify-add-container';
  const paradifySpotifyAddContainer = window.document.createElement('div');
  paradifySpotifyAddContainer.id = containerName;
  paradifySpotifyAddContainer.style.cssText = 'display: none;';

  window.document.body.appendChild(paradifySpotifyAddContainer);
  if (
    window.location.href.indexOf('youtube.com/watch') > -1 &&
    window.location.href.indexOf('music.youtube.com') === -1
  ) {
    render(
      <SpotifyIconInYouTube />,
      window.document.getElementById(containerName),
      // eslint-disable-next-line func-names
      function () {
        const spotifyButton = window.document.getElementById(containerName)
          .firstChild;
        try {
          const menuContainer = window.document.querySelector(
            '.ytp-chrome-controls .ytp-right-controls',
          );
          menuContainer.insertBefore(spotifyButton, menuContainer.firstChild);
        } catch (err) {
          paradifySpotifyAddContainer.style.cssText =
            'opacity: 1; right: 10px !important; position: fixed !important; bottom: 50px !important; margin: 5px; background-color: transparent; display: ;';
        }
      },
    );
  }
};

const loadInjection = () => {
  injectParadifyAddContainer();
};

const onLoad = () => {
  paradify.pageLoad();

  setTimeout(() => {
    contentUtil.youTubeTitle(() => {
      loadInjection();
    });
  }, 2000);
};

window.addEventListener('load', onLoad, false);
