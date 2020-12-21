import React from 'react';
import spotifyLogoGreen from '../../img/Spotify_Icon_RGB_Green.png';
import {
  paradify,
  getSearchTextFromTrackInfo,
  getSpotifySearchUrl,
  contentSpotifyAddButtonStyle,
  imageSpotifyAddButtonStyle,
  contentContainernStyle,
} from '../utils';

function AddIconIntoPlayerBar() {
  return (
    <>
      <button
        id="paradify"
        style={contentSpotifyAddButtonStyle}
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
            function (response) {
              console.log(response.farewell);
            },
          );
        }}
        draggable="false"
        className="playerButton ytp-button"
        title="Add to Spotify"
      >
        <div style={contentContainernStyle}>
          <img
            // eslint-disable-next-line no-undef
            src={chrome.runtime.getURL(spotifyLogoGreen)}
            width="24"
            height="24"
            title="Add to Spotify"
            style={imageSpotifyAddButtonStyle}
          />
        </div>
      </button>
    </>
  );
}

export default AddIconIntoPlayerBar;
