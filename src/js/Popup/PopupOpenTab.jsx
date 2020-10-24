import React, { useEffect, useState } from 'react';
import goodUrl from '../../img/good.png';
import badUrl from '../../img/bad.png';
import spotifyLogoGreen from '../../img/Spotify_Logo_RGB_Green_icon.png';
import youTubeLogo from '../../img/Youtube_logo.png';
import imageLetsStart from '../../img/giphy/lets-get-started.gif';
import '../../css/index.css';
import {
  initializeReactGA,
  getSearchTextFromTrackInfo,
  getSpotifySearchUrl,
} from '../utils';

import ReactGA from 'react-ga';

import { supportedWebsite } from '../utils/constants';

const extensionId = chrome.runtime.id;

function PopupOpenTab() {
  const [trackInfoBeforeSearch, setTrackInfoBeforeSearch] = useState(null);
  const [notification, setNotification] = useState(null);
  const [query, setQuery] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const refSearchInput = React.useRef();

  const readTrackInfoFromThepage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = tabs[0].url.toLowerCase();

      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: 'getTrackInfo', url },
        function (data) {
          if (data != undefined && data.success && data.track != undefined) {
            setTrackInfoBeforeSearch(data.track);
            const uri = new URL(url);
            ReactGA.event({
              category: 'Track',
              action: 'Track Info Load - Found',
              label: `${decodeURIComponent(uri.hostname)}`,
            });
          } else {
            try {
              const uri = new URL(url);
              ReactGA.event({
                category: 'Track',
                action: 'Track Info Load - Not Found',
                label: `${decodeURIComponent(uri.hostname)}`,
              });
            } catch {}
          }
        }
      );
    });
  };

  const start = () => {
    chrome.runtime.sendMessage(extensionId, { type: 'clearBadge' });
    initializeReactGA(ReactGA, 'popup');
    readTrackInfoFromThepage();
  };

  useEffect(() => {
    start();
  }, []);

  const search = (q) => {
    ReactGA.event({
      category: 'Search',
      action: 'Search',
      label: decodeURIComponent(q),
    });

    setTimeout(() => {
      chrome.tabs.create({ url: getSpotifySearchUrl(q) });
    }, 100);
  };

  const getSearchResult = () => {
    search(query);
  };

  useEffect(() => {
    if (!trackInfoBeforeSearch) return;
    const q = getSearchTextFromTrackInfo(trackInfoBeforeSearch);
    setQuery(q);
  }, [trackInfoBeforeSearch]);

  useEffect(() => {
    if (!query) return;
    getSearchResult();
  }, [query]);

  const showInfo = (message) => {
    const model = { type: 'info', message };
    setNotification(model);
    setTimeout(() => {
      setNotification({});
    }, 5000);
  };

  const renderSearchForm = () => {
    return (
      <>
        <div className='mt-4'>
          <form
            onSubmit={(e) => {
              if (refSearchInput.current) {
                setTrackInfoBeforeSearch({
                  trackName: refSearchInput.current.value,
                });
              }
              e.preventDefault();
            }}
          >
            <p>Search</p>
            <input
              ref={refSearchInput}
              type='text'
              defaultValue={query}
              className='text-gray-700 appearance-none rounded-r rounded-l border border-gray-700 border-b block pl-4 pr-4 py-2 w-full  text-sm focus:placeholder-gray-600 focus:outline-none'
              placeholder='Or search a song here'
            />
          </form>
        </div>
      </>
    );
  };

  const renderSurvey = () => {
    return (
      <>
        {showSurvey && (
          <div className='flex items-center mt-2'>
            Did you like new Paradify?
            <div className='ml-1'>
              <button
                onClick={() => {
                  ReactGA.event({
                    category: 'Survey',
                    action: 'Did you like new design',
                    label: 'No',
                  });
                  showInfo('Thank you!');
                  setShowSurvey(false); //
                  chrome.storage.sync.set({ survey_g_b_done: true }, () => {});
                }}
              >
                <img src={badUrl} width='30' />
              </button>
            </div>
            <div className='ml-2'>
              <button
                onClick={() => {
                  ReactGA.event({
                    category: 'Survey',
                    action: 'Did you like new design',
                    label: 'Yes',
                  });
                  showInfo('Thank you!');
                  setShowSurvey(false);
                  chrome.storage.sync.set({ survey_g_b_done: true }, () => {});
                }}
              >
                <img src={goodUrl} width='30' />
              </button>
            </div>
          </div>
        )}
      </>
    );
  };

  const renderInitial = () => {
    return (
      <div>
        <div className='text-md text-orange-400 mt-4'>
          <div className='text-base text-center'>
            first open a video on{' '}
            <button
              className='font-semibold underline'
              onClick={() => {
                ReactGA.event({
                  category: 'Off Site',
                  action: 'Supported Website Click',
                  label: decodeURIComponent(supportedWebsite.name),
                });
                setTimeout(() => {
                  chrome.tabs.create({ url: supportedWebsite.href });
                }, 300);
              }}
            >
              {supportedWebsite.name}
            </button>
          </div>
          <div className='mt-4'>
            <img src={imageLetsStart} alt='' className='w-full' />
          </div>
        </div>
      </div>
    );
  };

  const renderMessageBox = () => {
    if (!notification) {
      return null;
    }
    switch (notification.type) {
      case 'info':
        return (
          <div
            className='flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-2 my-2'
            role='alert'
          >
            <svg
              className='fill-current w-4 h-4 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z' />
            </svg>
            <p>{notification.message}</p>
          </div>
        );
      case 'error':
        return (
          <div
            className='flex items-center bg-red-500 text-white text-sm font-bold px-4 py-2 my-2'
            role='alert'
          >
            <svg
              className='fill-current w-4 h-4 mr-2'
              xmlns='http://www.w3.org/2000/svg'
              viewBox='0 0 20 20'
            >
              <path d='M12.432 0c1.34 0 2.01.912 2.01 1.957 0 1.305-1.164 2.512-2.679 2.512-1.269 0-2.009-.75-1.974-1.99C9.789 1.436 10.67 0 12.432 0zM8.309 20c-1.058 0-1.833-.652-1.093-3.524l1.214-5.092c.211-.814.246-1.141 0-1.141-.317 0-1.689.562-2.502 1.117l-.528-.88c2.572-2.186 5.531-3.467 6.801-3.467 1.057 0 1.233 1.273.705 3.23l-1.391 5.352c-.246.945-.141 1.271.106 1.271.317 0 1.357-.392 2.379-1.207l.6.814C12.098 19.02 9.365 20 8.309 20z' />
            </svg>
            <p>{notification.message}</p>
          </div>
        );
    }
  };

  const render = () => {
    return (
      <>
        <div className='flex justify-between items-center'>
          <div className='flex items-baseline'>
            <h2 className='text-2xl font-semibold leading-tight'>Paradify</h2>
            <div className='ml-5 flex items-center'>
              <img src={youTubeLogo} width='70' height='21' className='ml-1' />
              <span className='arrow' />
              <img
                src={spotifyLogoGreen}
                width='70'
                height='21'
                className='ml-1'
              />
            </div>
          </div>
        </div>
        {renderMessageBox()}
        {trackInfoBeforeSearch ? (
          <>
            {query && (
              <>
                <div className='my-2 text-white font-semibold'>
                  <h4 className='text-lg'>{query}</h4>
                </div>
              </>
            )}
          </>
        ) : (
          <>{renderInitial()}</>
        )}

        <div>
          <div className='inline-block min-w-full shadow overflow-hidden'>
            {renderSearchForm()}
            <div className='mt-4'>
              <p>Note: not all the songs can be found in Spotify</p>
            </div>
            <div className='text-right mt-4'>
              <button
                onClick={() => {
                  ReactGA.event({
                    category: 'On Site',
                    action: 'Contact Click',
                  });
                  const url = 'https://forms.gle/LPnQpiLchg2oHb6MA';
                  setTimeout(() => {
                    chrome.tabs.create({ url });
                  }, 300);
                }}
              >
                Contact
              </button>
            </div>
            {renderSurvey()}
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      <div className='antialiased font-mono text-gray-300'>
        <div className='mx-auto px-4 py-2'>{render()}</div>
      </div>
    </>
  );
}

export default PopupOpenTab;
