import React, { FC } from 'react';
import { Dialog } from '../interfaces';
import { getRandomFailedGif, getRandomSuccessGif } from '../utils';

const ContentTest: FC = () => {
  const SongNotFound = () => {
    const dialog: Dialog = {
      behavior: { autoHide: true, hideTimeout: 3000 },
      message: {
        title: 'Not Found',
        text: `The video was not found in Spotify.`,
        imgUrl: getRandomFailedGif(),
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const FailedKeepDialog = () => {
    const dialog: Dialog = {
      behavior: { autoHide: false },
      message: {
        title: 'Failed',
        text: `Failed Failed Failed Failed Failed in Spotify.`,
        imgUrl: getRandomFailedGif(),
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const SongSaved = () => {
    const dialog: Dialog = {
      behavior: { autoHide: true },
      message: {
        title: 'Saved',
        text: `The video has been saved in Spotify as "{track.name}"`,
        url: 'track.external_urls.spotify',
        imgUrl: getRandomSuccessGif(),
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const SuccessKeepDialog = () => {
    const dialog: Dialog = {
      behavior: { autoHide: false },
      message: {
        title: 'Saved',
        text: `The video has been saved in Spotify as "{track.name}"`,
        url: 'track.external_urls.spotify',
        imgUrl: getRandomSuccessGif(),
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  return (
    <>
      <div className="max-w-700 mx-auto text-sm text-gray-800">
        <div>
          <button onClick={() => SongNotFound()}>Song Not found</button>
          <button onClick={() => FailedKeepDialog()}>
            Failed - Keep Dialog
          </button>
        </div>
        <div>
          <button onClick={() => SongSaved()}>Song Saved</button>
          <button onClick={() => SuccessKeepDialog()}>
            Success Keep Dialog
          </button>
        </div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default ContentTest;
