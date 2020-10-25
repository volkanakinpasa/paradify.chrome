import React from 'react';
import spotifyLogoGreen from '../../img/Spotify_Icon_RGB_Green.png';
import {
  paradify,
  getSearchTextFromTrackInfo,
  getSpotifySearchUrl,
  contentSpotifyAddButtonStyle,
  imageSpotifyAddButtonStyle,
} from '../utils';

function AddIconIntoPlayerBar() {
  return (
    <>
      <button
        id='paradify'
        style={contentSpotifyAddButtonStyle}
        onClick={() => {
          var trackInfo = paradify.getTrackInfo(location.href);
          const query = getSearchTextFromTrackInfo(trackInfo.track);
          window.open(getSpotifySearchUrl(query), '_blank');
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
        draggable='false'
        className='playerButton ytp-button'
        title='Add to Spotify'
      >
        <img
          src={chrome.runtime.getURL(spotifyLogoGreen)}
          width='24'
          height='24'
          title='Add to Spotify'
          style={imageSpotifyAddButtonStyle}
        />
      </button>
    </>
  );
}

export default AddIconIntoPlayerBar;
