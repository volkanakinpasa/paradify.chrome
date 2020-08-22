import React from 'react';
import spotifyLogoGreen from '../../img/Spotify_Icon_RGB_Green.png';
import {
  paradify,
  getSearchTextFromTrackInfo,
  filterQuery,
  contentSpotifyAddButtonStyle,
} from '../utils';

function AddButtonContainer() {
  return (
    <>
      <button
        style={contentSpotifyAddButtonStyle}
        onClick={() => {
          var trackInfo = paradify.getTrackInfo(location.href);
          const query = getSearchTextFromTrackInfo(trackInfo.track);
          window.open(
            `https://open.spotify.com/search/${filterQuery(query)}`,
            '_blank'
          );
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
            }
          );
        }}
      >
        <img
          src={chrome.runtime.getURL(spotifyLogoGreen)}
          width='30'
          title='Add to Spotify'
        />
      </button>
    </>
  );
}

export default AddButtonContainer;
