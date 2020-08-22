import { hot } from 'react-hot-loader/root';
import React, { useEffect, useState } from 'react';
const axios = require('axios').create();
import { Service } from 'axios-middleware';
import playUrl from '../../img/play_m.png';
import pauseUrl from '../../img/pause_m.png';
import goodUrl from '../../img/good.png';
import badUrl from '../../img/bad.png';
import spotifyLogoGreen from '../../img/Spotify_Logo_RGB_Green_icon.png';
import imageSearchNotFound from '../../img/giphy/search-not-found.gif';
import imageLetsStart from '../../img/giphy/lets-get-started.gif';
import imageSignin from '../../img/giphy/sign-in.gif';
import '../../css/index.css';
import { initializeReactGA, getSearchTextFromTrackInfo } from '../utils';

import ReactGA from 'react-ga';

import {
  getRedirectAuthUrl,
  getSearchUrl,
  getPlaylistUrl,
  getMeUrl,
  getRefreshUrl,
  supportedWebsite,
} from '../utils/constants';

const extensionId = chrome.runtime.id;

function Index() {
  const [token, setToken] = useState(null);
  const [tokenExpired, setTokenExpired] = useState(null);
  const [loginNeeded, setLoginNeeded] = useState(false);
  const [trackInfoBeforeSearch, setTrackInfoBeforeSearch] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searchReady, setSearchReady] = useState(null);
  const [me, setMe] = useState(null);
  const [pageRead, setPageReady] = useState(true);
  const [playlistSelectedValue, setPlaylistSelectedValue] = useState(true);
  const [notification, setNotification] = useState(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);
  const [query, setQuery] = useState(null);
  const [showSurvey, setShowSurvey] = useState(false);
  const refPlaylist = React.useRef();
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
            setPageReady();

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

  const interceptAxios = () => {
    let temp_access_token;
    const service = new Service(axios);
    service.register({
      onRequest(config) {
        if (temp_access_token) {
          config.headers['access_token'] = temp_access_token;
        } else {
          if (!config.headers['access_token'])
            config.headers['access_token'] = token.access_token;
        }

        config.headers['refresh_token'] = token.refresh_token;
        config.headers['token_type'] = token.token_type;
        return config;
      },

      onResponse(response) {
        const { data } = response;
        let d = null;
        if (typeof data === 'string') d = JSON.parse(data);
        else d = data;

        if (d.error && d.error.status === 401) {
          try {
            ReactGA.event({
              category: 'Token',
              action: 'Token Refresh',
            });
          } catch {}
          return axios
            .get(getRefreshUrl(), {
              params: {
                refresh_token: token.refresh_token,
              },
            })
            .then((responseGet) => {
              if (
                responseGet &&
                responseGet.data &&
                responseGet.data.access_token
              ) {
                const { ...tempToken } = token;
                tempToken.access_token = responseGet.data.access_token;
                temp_access_token = responseGet.data.access_token;
                setToken(tempToken);
                response.config.headers['access_token'] =
                  tempToken.access_token;
                chrome.storage.sync.set({ token: tempToken }, () => {});
                return axios.request(response.config);
              } else {
                try {
                  ReactGA.event({
                    category: 'Token',
                    action: 'Token Refresh Not Found Access Token',
                  });
                } catch {}
                return Promise.reject();
              }
            })
            .catch((error) => {
              try {
                ReactGA.event({
                  category: 'Error',
                  action: 'Token Refresh Error',
                });
              } catch {}
              return Promise.reject(error);
            });
        } else return response;
      },
    });
  };

  const start = () => {
    chrome.runtime.sendMessage(extensionId, { type: 'clearBadge' });

    chrome.storage.sync.get(['token'], (data) => {
      if (
        !data.token ||
        !data.token.access_token ||
        !data.token.refresh_token
      ) {
        const url = getRedirectAuthUrl();
        setLoginNeeded(true);
      } else {
        setToken(data.token);
        readTrackInfoFromThepage();
      }
    });

    chrome.storage.sync.get(['survey_g_b_done'], (data) => {
      if (data.survey_g_b_done) {
        setShowSurvey(false);
      } else {
        setShowSurvey(true);
      }
    });

    initializeReactGA(ReactGA, 'popup');
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

    axios
      .get(getSearchUrl() + '?q=' + q)
      .then((response) => {
        var i = 0;
        const { data } = response;
        let d = null;
        if (typeof data === 'string') d = JSON.parse(data);
        else d = data;

        if (d.error) {
        } else {
          setSearchResult(d);
          setSearchReady(true);
          if (!d || !d.tracks || d.tracks.total === 0) {
            ReactGA.event({
              category: 'Search',
              action: 'Search Not Found',
              label: decodeURIComponent(q),
            });
          }
        }
      })
      .catch((error) => {
        ReactGA.event({
          category: 'Error',
          action: 'Search Error',
          label: decodeURIComponent(q),
        });
      })
      .finally(() => {
        setPageReady(true);
      });
  };

  const getSearchResult = () => {
    search(query);
  };

  useEffect(() => {
    if (!trackInfoBeforeSearch) return;
    interceptAxios();
    const q = getSearchTextFromTrackInfo(trackInfoBeforeSearch);
    setQuery(q);
  }, [trackInfoBeforeSearch]);

  useEffect(() => {
    if (!query) return;

    getSearchResult();
  }, [query]);

  useEffect(() => {}, [token]);

  useEffect(() => {
    if (!playlist || playlist.items.length === 0) return;
    setPlaylistSelectedValue(playlist.items[0].id);
  }, [playlist]);

  const loadPlaylist = (me) => {
    axios
      .get(getPlaylistUrl(), {
        params: {
          profileId: me.id,
        },
      })
      .then((response) => {
        // handle success
        const { data } = response;
        data.items = data.items.filter((item) => item.owner.id === me.id);
        setPlaylist(data);
      })
      .catch((error) => {
        ReactGA.event({
          category: 'Error',
          action: 'Playlist Get Error',
        });
      })
      .finally(() => {
        // always executed
      });
  };

  useEffect(() => {
    async function fetchData() {
      if (
        !searchResult ||
        !searchResult.tracks ||
        searchResult.tracks.total === 0
      )
        return;

      if (!me || !me.id) return;

      if (!playlist) loadPlaylist(me);
    }
    fetchData();
  }, [searchResult, me]);

  const loadMe = () => {
    const url = getMeUrl();
    axios
      .get(url)
      .then((meResponse) => {
        if (!meResponse.data || !meResponse.data.id) return;
        setMe(meResponse.data);
      })
      .catch((error) => {
        ReactGA.event({
          category: 'Error',
          action: 'Me Get Error',
        });
      });
  };

  useEffect(() => {
    if (token && !me) {
      loadMe();
    }
  }, [searchResult]);

  const showError = (message) => {
    const model = { type: 'error', message };
    setNotification(model);
    setTimeout(() => {
      setNotification({});
    }, 5000);
  };

  const showInfo = (message) => {
    const model = { type: 'info', message };
    setNotification(model);
    setTimeout(() => {
      setNotification({});
    }, 5000);
  };

  const onClickAddTrackToPlaylist = (trackId, trackName) => {
    async function addData() {
      try {
        ReactGA.event({
          category: 'Track',
          action: 'Add To Playlist Click',
          label: decodeURIComponent(trackName),
        });
      } catch {}

      if (
        !refPlaylist ||
        !refPlaylist.current ||
        refPlaylist.current.value === ''
      ) {
        showError('Please select a playlist');
        ReactGA.event({
          category: 'Warning',
          action: 'Playlist Not Selected',
          label: decodeURIComponent(trackName),
        });
        return;
      }

      try {
        axios
          .post(getPlaylistUrl(), null, {
            params: { playlistId: refPlaylist.current.value, trackId },
          })
          .then(function (response) {
            if (response.data.error != null) {
              ReactGA.event({
                category: 'Track',
                action: 'Add To Playlist Failed',
                label: decodeURIComponent(trackName),
              });
              showError('Something went wrong!');
            } else {
              ReactGA.event({
                category: 'Track',
                action: 'Add To Playlist Success',
                label: decodeURIComponent(trackName),
              });
              showInfo('Saved');
            }
          })
          .catch(function (error) {
            showError('Something went wrong!');
            ReactGA.event({
              category: 'Error',
              action: 'Add To Playlist Error',
              label: decodeURIComponent(trackName),
            });
          });
      } catch {
        showError('Something went wrong!');
        ReactGA.event({
          category: 'Error',
          action: 'Add To Playlist Error',
          label: decodeURIComponent(trackName),
        });
      }
    }
    addData();
  };

  let audio;
  const play = (url, currentPlayingIndexParam, trackName) => {
    if (currentAudio != null) {
      currentAudio.pause();
    }

    audio = new Audio();
    audio.src = url;
    audio.play();

    setCurrentPlayingIndex(currentPlayingIndexParam);
    setCurrentAudio(audio);
    ReactGA.event({
      category: 'Track',
      action: 'Play Click',
      label: decodeURIComponent(trackName),
    });
  };

  const pause = (trackName) => {
    if (currentAudio != null) {
      currentAudio.pause();
    }

    setCurrentPlayingIndex(null);
    ReactGA.event({
      category: 'Track',
      action: 'Pause Click',
      label: decodeURIComponent(trackName),
    });
  };

  const logout = () => {
    chrome.storage.sync.set({ token: null }, () => {
      setToken(null);
      setMe(null);
      setLoginNeeded(true);
      ReactGA.event({
        category: 'On Site',
        action: 'Logout Click',
      });
    });
  };

  const renderMe = () => {
    return (
      <div>
        <div>
          {me && me.images && me.images.length > 0 && (
            <img
              src={me.images[0].url}
              className='w-full h-full rounded-full'
            />
          )}
        </div>
        <div>
          {token && token.access_token ? (
            <button onClick={() => logout()}>logout</button>
          ) : (
            renderLogin()
          )}
        </div>
      </div>
    );
  };

  const renderPlaylist = () => {
    if (!playlist) return;

    return (
      <>
        <div className='mb-2 text-right'>
          {/* <div className='mb-1'>Your playlist</div> */}
          <div className='inline-block relative'>
            <select
              className='block appearance-none w-full bg-white border border-gray-400 
              hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight 
              focus:outline-none focus:shadow-outline text-black'
              id='grid-state'
              //onChange={handlePlaylistChange}
              ref={refPlaylist}
            >
              {playlist.items.length > 0 && (
                <option key={-1} value={''}>
                  Select playlist
                </option>
              )}
              {playlist.items.map((item, i) => {
                return (
                  <option key={i} value={item.id}>
                    {item.name}
                  </option>
                );
              })}
            </select>
            <div className='pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700'>
              <svg
                className='fill-current h-4 w-4'
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 20 20'
              >
                <path d='M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z' />
              </svg>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderNoTrackFound = () => {
    return (
      <>
        <div className='min-w-full mb-2 text-center'>
          No track found. You may filter your search.
          <img src={imageSearchNotFound} alt='' className='w-full' />
        </div>
      </>
    );
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

  const renderList = () => {
    return (
      <>
        {searchResult.tracks.total > 0 && (
          <>
            <div className='min-w-full'>
              <div className='w-full border-t border-gray-700 border-opacity-50'>
                {searchResult.tracks.total > 0 &&
                  searchResult.tracks.items.map((item, i) => {
                    return (
                      <div key={i} className='flex w-full'>
                        <div className='pl-2 py-2 border-b border-gray-700 border-opacity-50 flex items-center'>
                          <button
                            className='gree-add-button text-white font-semibold 
                            rounded-full w-16 h-6 focus:outline-none focus:shadow-outline
                            transition duration-500 ease-in-out transform hover:-translate-1 hover:scale-110'
                            onClick={() => {
                              onClickAddTrackToPlaylist(item.id, item.name);
                            }}
                          >
                            Add
                          </button>
                        </div>
                        <div className='pl-2 py-2 border-b border-gray-700 border-opacity-50 flex-grow flex'>
                          <div className='flex-grow'>
                            <div className='flex items-center'>
                              <div className='flex-shrink-0 w-10'>
                                {item.preview_url ? (
                                  currentPlayingIndex === i ? (
                                    <>
                                      <img
                                        src={pauseUrl}
                                        className='w-full h-full rounded-full'
                                        alt={item.name}
                                        title={item.name}
                                        onClick={() => pause(item.name)}
                                        height='40'
                                        width='40'
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={playUrl}
                                        className='w-full h-full rounded-full'
                                        alt={item.name}
                                        title={item.name}
                                        onClick={() =>
                                          play(item.preview_url, i, item.name)
                                        }
                                        height='40'
                                        width='40'
                                      />
                                    </>
                                  )
                                ) : (
                                  ''
                                )}
                              </div>
                              <div className='ml-2 flex-shrink-0 w-10'>
                                <img
                                  className='w-full h-full rounded-full'
                                  src={item.album.images[0].url}
                                  alt={item.name}
                                  title={item.name}
                                />
                              </div>

                              <div className='ml-3'>
                                <p className='whitespace-no-wrap font-semibold  font-bold max-w-15 overflow-hidden'>
                                  {item.name}
                                </p>
                                <p className='whitespace-no-wrap font-normal text-xs max-w-15 overflow-hidden'>
                                  {item.artists[0].name}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className='text-xs px-2 pt-2 text-center'>
              Showing {searchResult.tracks.items.length} to{' '}
              {searchResult.tracks.total}
            </div>
          </>
        )}
      </>
    );
  };

  const renderInitial = () => {
    return (
      <div>
        <div className='text-md text-orange-400 mt-4'>
          <div>
            Open{' '}
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
            , watch a song, click Paradify...
          </div>
          <div className='mt-4'>
            <img src={imageLetsStart} alt='' className='w-full' />
          </div>
        </div>
        {renderSearchForm()}
      </div>
    );
  };

  const renderLogin = () => {
    return (
      <div>
        <button
          onClick={() => {
            ReactGA.event({
              category: 'On Site',
              action: 'Login Click',
            });
            const url = getRedirectAuthUrl();
            setTimeout(() => {
              var w = 650;
              var h = 600;
              var left = screen.width / 2 - w / 2;
              var top = screen.height / 2 - h / 2;
              chrome.windows.create(
                {
                  url,
                  type: 'popup',
                  width: w,
                  height: h,
                  left: left,
                  top: top,
                },
                (window) => {}
              );
            }, 300);
          }}
        >
          Login
        </button>
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
            className='flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-1 mb-2'
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
            className='flex items-center bg-red-500 text-white text-sm font-bold px-4 py-1 mb-2'
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
            <div className='ml-1 flex items-center'>
              integrated with{' '}
              <img
                src={spotifyLogoGreen}
                width='70'
                height='21'
                className='ml-1'
              />
            </div>
          </div>
          <div className='flex-shrink-0 w-10'>{renderMe()}</div>
        </div>
        {!loginNeeded && query && (
          <>
            <div className='my-2 text-white font-semibold'>
              <h4 className='text-lg'>{query}</h4>
            </div>
          </>
        )}
        {renderMessageBox()}
        <div>
          <div>
            {!loginNeeded &&
              searchReady &&
              searchResult &&
              searchResult.tracks &&
              searchResult.tracks.total > 0 &&
              renderPlaylist()}
          </div>
          <div className='inline-block min-w-full shadow overflow-hidden'>
            {!loginNeeded && searchReady ? (
              <>
                {searchResult &&
                searchResult.tracks &&
                searchResult.tracks.total > 0
                  ? renderList()
                  : renderNoTrackFound()}
                {renderSearchForm()}
              </>
            ) : (
              ''
            )}
            {loginNeeded ? (
              <>
                <div className='text-sm text-orange-400 my-4'>
                  <p>Please click 'Login' to start using Paradify.</p>
                  <p className='mt-4'>
                    <img src={imageSignin} alt='' />
                  </p>
                </div>
              </>
            ) : (
              <>
                {!trackInfoBeforeSearch && !searchReady && (
                  <>{renderInitial()}</>
                )}
              </>
            )}
            <div className='text-right'>
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

export default hot(Index);
