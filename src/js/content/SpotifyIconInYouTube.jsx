import React from 'react';
import SpotifySvg from '../../img/SpotifySvg.svg';
import {
  paradify,
  getSearchTextFromTrackInfo,
  getSpotifySearchUrl,
} from '../utils';

const contentSpotifyAddButtonStyle = {
  padding: '4% 0 0 0',
  border: 'none',
  backgroundColor: 'transparent',
  cursor: 'pointer',
};
const imageSpotifyAddButtonStyle = {
  height: '100%',
  top: '0px',
  bottom: '0px',
  display: 'block',
  margin: 'auto',
  width: '100%',
};

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
            function (response) {},
          );
        }}
        draggable="false"
        className="playerButton ytp-button"
        title="Add to Spotify"
      >
        <SpotifySvg
          width="100%"
          height="100%"
          title="Add to Spotify"
          style={imageSpotifyAddButtonStyle}
        />
      </button>
    </>
  );
}

export default AddIconIntoPlayerBar;
