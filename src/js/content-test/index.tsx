import React from 'react';
import { render } from 'react-dom';
import SpotifyIconInYouTube from '../content/SpotifyIconInYouTube';
import ModalDialogInYouTube from '../content/dialog/ModalDialogInYouTube';
import { paradify } from '../utils';
import './content-test.css';
import '../content/content.css';
import { Dialog } from '../interfaces';
import ContentTest from './ContentTest';

const injectParadifyAddContainer = () => {
  const containerName = 'paradify-spotify-add-container';

  //Add youtube container in order to inject spotify icon
  const yt = window.document.createElement('div');
  yt.className = 'ytp-chrome-controls ytp-right-controls';
  window.document.body.appendChild(yt);

  const paradifyMainContainer = window.document.createElement('div');
  paradifyMainContainer.id = containerName;
  paradifyMainContainer.className = 'paradify-container-in-youtube';

  window.document.body.appendChild(paradifyMainContainer);

  render(
    <SpotifyIconInYouTube />,
    window.document.getElementById(containerName),
    function () {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const hede = window.document.getElementById(containerName);
      const spotifyIcon = hede.firstChild;

      try {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const ytPlayerMenuDiv = window.document.querySelector(
          '.ytp-chrome-controls',
        );

        ytPlayerMenuDiv.appendChild(spotifyIcon as Node);
      } catch (err) {
        paradifyMainContainer.insertBefore(
          spotifyIcon as Node,
          paradifyMainContainer.firstChild,
        );
        paradifyMainContainer.className =
          'paradify-container-in-youtube-absolute';
      }
    },
  );
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
  render(<ContentTest />, window.document.getElementById('app-container'));
  paradify.pageLoad();

  setTimeout(() => {
    loadInjection();
  }, 100);
};

window.addEventListener('load', onLoad, false);
