import React, { useEffect } from 'react';
import spotifyLogoGreen from '../../img/Spotify_Logo_RGB_Green_icon.png';
import { hot } from 'react-hot-loader/root';

function Header() {
  useEffect(() => {
    // start();
  }, []);

  const renderHeader = () => {
    return (
      <>
        <div className="flex justify-between items-center">
          <div className="flex items-baseline">
            <h2 className="text-2xl font-semibold leading-tight">Paradify</h2>
            <div className="ml-1 flex items-center">
              search for songs in{' '}
              <img
                src={spotifyLogoGreen}
                width="70"
                height="21"
                className="ml-1"
              />
            </div>
          </div>
        </div>
      </>
    );
  };

  return <>{renderHeader()}</>;
}

export default hot(Header);
