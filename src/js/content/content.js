/* eslint-disable prefer-arrow-callback */
/* eslint-disable react/jsx-filename-extension */
// import ParadifySpotifyAddContainer from './Content/ParadifySpotifyAddContainer.jsx';
import React from 'react';
import { render } from 'react-dom';
import SpotifyIconInYouTube from './SpotifyIconInYouTube.jsx';
import { paradify, contentUtil } from '../utils';
import './content.css';

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
  const paradifyMainContainer = window.document.createElement('div');
  paradifyMainContainer.id = containerName;
  paradifyMainContainer.className = 'paradify-container-in-youtube';

  window.document.body.appendChild(paradifyMainContainer);
  if (
    window.location.href.indexOf('youtube.com/watch') > -1 &&
    window.location.href.indexOf('music.youtube.com') === -1
  ) {
    render(
      <SpotifyIconInYouTube />,
      window.document.getElementById(containerName),
      // eslint-disable-next-line func-names
      function () {
        const spotifyIcon = window.document.getElementById(containerName)
          .firstChild;
        try {
          const ytPlayerMenuDiv = window.document.querySelector(
            '.ytp-chrome-controls .ytp-right-controls',
          );
          ytPlayerMenuDiv.insertBefore(spotifyIcon, ytPlayerMenuDiv.firstChild);
        } catch (err) {
          paradifyMainContainer.insertBefore(
            spotifyIcon,
            paradifyMainContainer.firstChild,
          );
          paradifyMainContainer.className =
            'paradify-container-in-youtube-absolute';
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
    //when the page is loade
    loadInjection();
    //when the title is changed
    contentUtil.youTubeTitle(() => {
      loadInjection();
    });
  }, 2000);
};

window.addEventListener('load', onLoad, false);
