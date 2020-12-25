import React from 'react';
import SpotifySvg from '../../img/SpotifySvg.svg';
import {
  paradify,
  getSearchTextFromTrackInfo,
  getSpotifySearchUrl,
} from '../utils';

import './content.css';

function AddIconIntoPlayerBar() {
  return (
    <>
      <button
        id="paradify"
        className="spotify-button-in-yt-player"
        onClick={() => {
          var trackInfo = paradify.getTrackInfo(location.href);
          const query = getSearchTextFromTrackInfo(trackInfo.track);
          if (query.length === 0) {
            alert('No played song/video clip found.');
            return;
          }
          window.open(getSpotifySearchUrl(query), '_blank');
          // eslint-disable-next-line no-undef
          chrome.runtime.sendMessage(
            {
              type: 'addIconClicked',
              data: {
                pageName: 'YouTube',
                eventCategory: 'YouTube Video',
                eventAction: 'Spotify Add Button Click',
                eventLabel: query,
              },
            },
            function (response) {},
          );
        }}
        draggable="false"
        className="playerButton ytp-button"
        title="Search in Spotify"
      >
        <SpotifySvg
          width="100%"
          height="100%"
          title="Search in Spotify"
          className="spotify-icon-in-yt-player"
        />
      </button>
    </>
  );
}

export default AddIconIntoPlayerBar;
