import React from 'react';
import { render } from 'react-dom';
import SpotifyIconInYouTube from './SpotifyIconInYouTube';
import ModalDialogInYouTube from './dialog/ModalDialogInYouTube';
import { paradify, contentUtil } from '../utils';

const injectParadifyAddContainer = () => {
  if (
    window.location.href.indexOf('youtube.com/watch') > -1 &&
    window.location.href.indexOf('music.youtube.com') === -1
  ) {
    const containerName = 'paradify-spotify-add-container';
    if (window.document.getElementById(containerName)) {
      return;
    }
    const paradifyMainContainer = window.document.createElement('div');
    paradifyMainContainer.id = containerName;
    paradifyMainContainer.className = 'paradify-container-in-youtube';

    window.document.body.appendChild(paradifyMainContainer);

    render(
      <SpotifyIconInYouTube />,
      window.document.getElementById(containerName),
      // eslint-disable-next-line func-names
      function () {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const hede = window.document.getElementById(containerName)!;
        const spotifyIcon = hede.firstChild;

        try {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const ytPlayerMenuDiv = window.document.querySelector(
            '.ytp-chrome-controls .ytp-right-controls',
          )!;

          ytPlayerMenuDiv.insertBefore(
            spotifyIcon as Node,
            ytPlayerMenuDiv.firstChild,
          );
        } catch (err) {
          // paradifyMainContainer.insertBefore(
          //   spotifyIcon,
          //   paradifyMainContainer.firstChild,
          // );
          // paradifyMainContainer.className =
          //   'paradify-container-in-youtube-absolute';
        }
      },
    );
  }
};

const injectDialogWindow = () => {
  const dialogName = 'p-d-paradify-dialog-in-youtube';

  //Create dialog
  const dialog = window.document.createElement('div');
  dialog.className = dialogName;
  dialog.id = dialogName;

  window.document.body.appendChild(dialog);
  render(<ModalDialogInYouTube />, window.document.getElementById(dialogName));
};

const loadInjection = () => {
  injectParadifyAddContainer();
  injectDialogWindow();
};

const onLoad = () => {
  paradify.pageLoad();

  setTimeout(() => {
    //when the page is loaded
    loadInjection();
    //when the title is changed
    contentUtil.youTubeTitle(() => {
      loadInjection();
    });
  }, 2000);
};

window.addEventListener('load', onLoad, false);
