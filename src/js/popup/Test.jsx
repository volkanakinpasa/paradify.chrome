import React, { useEffect, useState } from 'react';
import { getPageName } from './variable';
import axios from 'axios';
import playUrl from '../../img/play.png';
import pauseUrl from '../../img/pause.png';
import '../../css/notification.css';

const extensionId = 'bekjegdpflamfhmjofgomolbpgnjakbb';
function Test() {
  const [token, setToken] = useState(null);
  const [track, setTrack] = useState(null);
  const [playlist, setPlaylist] = useState(null);
  const [searchItems, setSearchItems] = useState(null);
  const [me, setMe] = useState(null);
  const [pageRead, setPageReady] = useState(true);
  const [playlistSelectedValue, setPlaylistSelectedValue] = useState(true);
  const [notification, setNotification] = useState(null);
  const [currentPlayingIndex, setCurrentPlayingIndex] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

  const readTrackInfoFromThepage = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      var url = tabs[0].url.toLowerCase();

      var pageName = getPageName(url);
      chrome.tabs.sendMessage(
        tabs[0].id,
        { type: 'getTrackInfo', pageName: pageName },
        function (data) {
          if (data != undefined && data.success && data.track != undefined) {
            setTrack(data.track);
          } //else {
          //   var url = String.format('{0}?fromChrome=true', defaults.url);
          //   redirect(url);
          // }
        }
      );
    });
  };

  const start = () => {
    chrome.runtime.sendMessage(extensionId, { type: 'clearBadge' }, (data) => {
      const hede = data;
    });

    chrome.storage.sync.get(['token'], (data) => {
      setToken(data.token);
      if (
        !data.token ||
        !data.token.access_token ||
        !data.token.refresh_token
      ) {
        const url = 'https://localhost:5001/api/redirect_auth';
        console.log('redirect');
        chrome.tabs.create({ url });
      } else {
        // //temp delete this
        // const trackI = {
        //   track: {
        //     trackName: 'hello',
        //     artist: 'adele',
        //   },
        // };

        // setTrack(trackI.track);
        readTrackInfoFromThepage();
      }
    });
  };

  useEffect(() => {
    start();

    // chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    //   chrome.runtime.sendMessage({
    //     type: 'onPopupOpened',
    //     data: { key: 'test key' },
    //   });
    // });
  }, []);

  useEffect(() => {
    if (!track) return;
    // var query = String.format('{0} {1}', data.track, data.artist);
    // var url = String.format(
    //   '{0}{1}?q={2}&p={3}&fromChrome=true',
    //   defaults.url,
    //   defaults.searchPath,
    //   encodeURIComponent(query),
    //   pageName
    // );
    // redirect(url);

    axios
      .get('http://localhost:3000/searchResult')
      .then((response) => {
        if (!response.data || !response.data.searchItem) return;

        setSearchItems(response.data.searchItem);
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(() => {
        setPageReady(true);
      });
  }, [track]);

  useEffect(() => {
    if (!playlist || playlist.items.length === 0) return;
    setPlaylistSelectedValue(playlist.items[0].id);
  }, [playlist]);

  useEffect(() => {
    async function fetchData() {
      if (!searchItems) return;
      const meResponse = await axios.get('https://localhost:5001/api/me', {
        headers: {
          access_token: token.access_token,
          refresh_token: token.refresh_token,
        },
      });

      if (!meResponse.data || !meResponse.data.id) return;
      setMe(meResponse.data);
      axios
        .get('http://localhost:3000/getPlaylist', {
          headers: { access_token: 'sdfasdfsdf', refresh_token: 'tegfresss' },
        })
        .then((response) => {
          // handle success
          const { data } = response;
          data.items = data.items.filter(
            (item) => item.owner.id === meResponse.data.id
          );
          setPlaylist(data);
        })
        .catch((error) => {})
        .finally(() => {
          // always executed
        });
    }
    fetchData();
  }, [searchItems]);

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

  const onClickAdd = (trackId) => {
    async function addData() {
      if (!playlistSelectedValue) {
        showError('Please first select a playlist');
        return;
      }

      try {
        const response = await axios.post('http://localhost:3000/addpaylist', {
          token: token,
          track: trackId,
          playlist: playlistSelectedValue,
        });
        console.log(response);
        showInfo('The track has been added to your playlist');
      } catch {
        showError('Something went wrong!');
      }

      //show a meesage
    }
    addData();
  };

  const handlePlaylistChange = (e) => {
    setPlaylistSelectedValue(e.target.value);
  };

  let audio;
  const play = (url, currentPlayingIndexParam) => {
    if (currentAudio != null) {
      currentAudio.pause();
    }

    audio = new Audio();
    audio.src = url;
    audio.play();

    setCurrentPlayingIndex(currentPlayingIndexParam);
    setCurrentAudio(audio);
  };

  const pause = () => {
    if (currentAudio != null) {
      currentAudio.pause();
    }

    setCurrentPlayingIndex(null);
  };

  const renderMe = () => {
    return (
      me &&
      me.images &&
      me.images.length > 0 && (
        <img src={me.images[0].url} className='w-full h-full rounded-full' />
      )
    );
  };

  const renderPlaylist = () => {
    if (!playlist) return;

    return (
      <>
        <div className='inline-block relative mb-4'>
          <div className='mb-1'>Your playlist</div>
          <select
            className='block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-3 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline text-black'
            id='grid-state'
            onChange={handlePlaylistChange}
          >
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
      </>
    );
  };

  const renderNoTrackFound = () => {
    return (
      <>
        <div className='min-w-full'>No track found.</div>
      </>
    );
  };

  const renderList = () => {
    return (
      <>
        {searchItems.tracks.total > 0 && (
          <>
            <div className='min-w-full'>
              <div className='w-full border-t border-gray-700 border-opacity-50'>
                {searchItems.tracks.total > 0 &&
                  searchItems.tracks.items.map((item, i) => {
                    //const refPlay = React.createRef();
                    return (
                      <div key={i} className='flex w-full'>
                        <div className='pl-2 py-2 border-b border-gray-700 border-opacity-50 flex items-center'>
                          <button
                            className='gree-add-button text-white font-semibold 
                            rounded-full w-16 h-6 focus:outline-none focus:shadow-outline
                            transition duration-500 ease-in-out transform hover:-translate-1 hover:scale-110'
                            onClick={() => {
                              onClickAdd(item.id);
                            }}
                          >
                            Add
                          </button>
                        </div>
                        <div className='pl-2 py-2 border-b border-gray-700 border-opacity-50 flex-grow flex'>
                          <div className='flex-grow'>
                            <div className='flex items-center'>
                              <div className='flex-shrink-0 w-10 h-10'>
                                {item.preview_url ? (
                                  currentPlayingIndex === i ? (
                                    <>
                                      <img
                                        src={pauseUrl}
                                        className='w-full h-full rounded-full'
                                        alt={item.name}
                                        title={item.name}
                                        onClick={() => pause()}
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
                                          play(item.preview_url, i)
                                        }
                                      />
                                    </>
                                  )
                                ) : (
                                  ''
                                )}
                              </div>
                              <div className='ml-2 flex-shrink-0 w-10 h-10'>
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

            <div className='px-5 py-5 flex flex-col xs:flex-row items-center xs:justify-between'>
              <span className='text-xs'>
                Showing {searchItems.tracks.items.length} to{' '}
                {searchItems.tracks.total}
              </span>
            </div>
          </>
        )}
      </>
    );
  };

  const render = () => {
    return (
      <div className='py-4'>
        <div className='flex justify-between items-center'>
          <div>
            <h2 className='text-2xl font-semibold leading-tight'>Paradify</h2>
          </div>
          <div className='flex-shrink-0 w-10 h-10'>{renderMe()}</div>
        </div>
        {track && (
          <div className='my-2'>
            <h4 className='text-xl'>{track.trackName}</h4>
            <h6 className='text-base'>{track.artistName}</h6>
          </div>
        )}
        {renderMessageBox()}
        <div className='py-2'>
          <div>{renderPlaylist()}</div>
          <div className='inline-block min-w-full shadow rounded-lg overflow-hidden'>
            {searchItems ? renderList() : renderNoTrackFound()}
          </div>
        </div>
        <div className='my-2 flex flex-col'>
          <div className='block relative'>
            <span className='text-black h-full absolute inset-y-0 left-0 flex items-center pl-2'>
              <svg viewBox='0 0 24 24' className='h-4 w-4 fill-current'>
                <path d='M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z'></path>
              </svg>
            </span>
            <input
              placeholder='Search'
              className='text-gray-700 appearance-none rounded-r rounded-l border border-gray-700 border-b block pl-8 pr-6 py-2 w-full  text-sm focus:placeholder-gray-600 focus:outline-none'
            />
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
            className='flex items-center bg-blue-500 text-white text-sm font-bold px-4 py-3'
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
            className='flex items-center bg-red-500 text-white text-sm font-bold px-4 py-3'
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

  return pageRead && render();
}

export default Test;
