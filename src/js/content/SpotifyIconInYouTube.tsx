import React, { FC, useEffect, useState } from 'react';
import axios from 'axios';
import { Service } from 'axios-middleware';
import spotifyImageUrl from '../../img/spotify.png';
import loading from '../../img/loading_animated.gif';
import {
  paradify,
  getSearchTextFromTrackInfo,
  getSpotifySearchUrl,
  storageUtil,
  getRandomFailedGif,
  getRandomSuccessGif,
  getRandomErrorGif,
  getRandomDonationGif,
} from '../utils';
import {
  getAddTracksUrl,
  getAddTrackUrl,
  getRefreshUrl,
  URLS,
  DONATION_SHOW_SAVED_COUNTS,
  TIMEOUT_MS,
} from '../utils/constants';
import { Dialog, Token } from '../interfaces';

import { SpotifyOption } from '../enums';
import './content.css';

const {
  getSpotifyToken,
  getSpotifyOption,
  getSavedCount,
  increaseSavedCount,
} = storageUtil;

const SpotifyIconInYouTube: FC = () => {
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const refreshToken = async (response: any) => {
    const token: Token = await getSpotifyToken();

    return axios
      .get(getRefreshUrl(), {
        headers: {
          refresh_token: token?.refresh_token,
        },
      })
      .then((responseGet: any) => {
        if (
          responseGet &&
          responseGet.data &&
          responseGet.data.body &&
          responseGet.data.body.access_token
        ) {
          const { access_token } = responseGet.data.body;
          const { ...tempToken } = token;
          tempToken.access_token = access_token;
          response.config.headers['access_token'] = tempToken.access_token;
          storageUtil.setSpotifyToken(tempToken);
          return axios.request(response.config);
        } else {
          storageUtil.removeSpotifyToken();
          return Promise.reject();
        }
      })
      .catch((error: any) => {
        return Promise.reject(error);
      });
  };

  const openAuth = (): void => {
    chrome.runtime.sendMessage({
      type: 'openAuthRedirectUrl',
    });
  };

  const interceptAxios = () => {
    const service = new Service(axios);

    service.register({
      async onRequest(config: any) {
        const token: Token = await getSpotifyToken();
        config.headers['access_token'] = token?.access_token;
        config.headers['refresh_token'] = token?.refresh_token;
        config.headers['token_type'] = token?.token_type;
        return config;
      },

      async onResponse(response: any) {
        const { data } = response;
        let d = null;
        if (typeof data === 'string') d = JSON.parse(data);
        else d = data;

        if (d.error && d.error.status === 401) {
          if (d.error.message.indexOf('Invalid access token') > -1) {
            return openAuth();
          } else if (d.error.message.indexOf('access token expired') > -1) {
            return refreshToken(response);
          }
        } else return response;
      },
    });
  };

  const showDonationDialog = () => {
    const dialog: Dialog = {
      behavior: { autoHide: false },
      message: {
        title: 'Please Donate to Paradify',
        text:
          'We need your love, we need your support in order to keep Paradify on and effort our costs',
        image: { url: getRandomDonationGif() },
        link: { href: URLS.DONATION_PAYPAL, text: 'Please Donate to Paradify' },
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const saved = async (trackIds: string[] = [], playlistUrl: string) => {
    let title = '';
    let text = '';

    if (trackIds.length > 0) {
      const s = trackIds.length > 1 ? 's' : '';
      title = `${trackIds.length} track${s} added`;
      text = `${trackIds.length} track${s} added into your Spotify playlist`;
    }

    const dialog: Dialog = {
      behavior: { autoHide: true },
      message: {
        title,
        text,
        image: { url: getRandomSuccessGif() },
        link: { href: playlistUrl, text: 'Open your playlist' },
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });

    await increaseSavedCount();
    const savedCount = await getSavedCount();

    if (DONATION_SHOW_SAVED_COUNTS.includes(savedCount)) {
      setTimeout(() => {
        showDonationDialog();
      }, TIMEOUT_MS);
    }
  };

  const notSaved = (q: string = null) => {
    const dialog: Dialog = {
      behavior: { autoHide: true },
      message: {
        title: 'Not Found',
        text: `The video was not found in Spotify.`,
        image: { url: getRandomFailedGif() },
        link: {
          href: getSpotifySearchUrl(q),
          text: 'Open and search on Spotify',
        },
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const combineTrackNames = (
    list: Array<{ track: { name: string } }> = [],
    itemLimit = 5,
  ): string => {
    try {
      return list
        .slice(0, itemLimit)
        .map((item) => {
          return `"${item.track.name}"`;
        })
        .join(', ');
    } catch {
      return '';
    }
  };

  const searchAndSave = async (q: string) => {
    try {
      const url = getAddTrackUrl();
      setIsSaving(true);
      const response = await axios.post(url, null, {
        params: { q },
      });

      if (response.data?.data?.message === 'OK') {
        const { data } = response.data;
        const { trackIds, playlistUrl } = data;
        saved(trackIds, playlistUrl);
        chrome.runtime.sendMessage({
          type: 'addIconClicked',
          data: {
            pageName: 'YouTube',
            eventCategory: 'YouTube Video',
            eventAction: 'Spotify Icon Clicked - AutoSave - Saved',
            eventLabel: q,
          },
        });
      } else if (response.data?.data?.message === 'CONFIRMATION') {
        const { data } = response.data;
        const { type } = data;
        switch (type) {
          case 'playlist':
            const { playlist, playlistTracks } = data;
            const { name: playlistName } = playlist;

            const trackNameString = combineTrackNames(playlistTracks);

            const confirmationText = `A playlist has been found "${playlistName}" and has ${
              playlist.tracks.total
            } tracks in it. Do you want to add all ${
              playlist.tracks.total
            } tracks? ${
              trackNameString
                ? 'Some of the track names: ' + trackNameString
                : ''
            }`;

            const playlistDialog: Dialog = {
              behavior: { autoHide: false },
              message: {
                title: 'Playlist found',
              },
              confirmation: {
                text: confirmationText,
                data: playlist,
                dataType: 'playlist',
              },
            };

            chrome.runtime.sendMessage({
              type: 'showDialog',
              data: playlistDialog,
            });

            //GA
            chrome.runtime.sendMessage({
              type: 'addIconClicked',
              data: {
                pageName: 'YouTube',
                eventCategory: 'YouTube Video',
                eventAction: 'Spotify Icon Clicked - AutoSave - Multi',
                eventLabel: data.name, //playlist name
              },
            });
            break;
          // case 'album':
          //   const { album } = data;
          //   const { name, total_tracks } = album;

          //   const dialog: Dialog = {
          //     behavior: { autoHide: false },
          //     message: {
          //       title: 'Album found',
          //     },
          //     confirmation: {
          //       text: `Found album "${name}". It has ${total_tracks} tracks. Do you want to add all ${total_tracks} tracks?`,
          //       data: album,
          //       dataType: 'album',
          //     },
          //   };

          //   chrome.runtime.sendMessage({
          //     type: 'showDialog',
          //     data: dialog,
          //   });
          //   break;
          default:
            notSaved(q);
            chrome.runtime.sendMessage({
              type: 'addIconClicked',
              data: {
                pageName: 'YouTube',
                eventCategory: 'YouTube Video',
                eventAction: 'Spotify Icon Clicked - AutoSave - Not Saved',
                eventLabel: q,
              },
            });
            break;
        }
      } else {
        notSaved(q);
        chrome.runtime.sendMessage({
          type: 'addIconClicked',
          data: {
            pageName: 'YouTube',
            eventCategory: 'YouTube Video',
            eventAction: 'Spotify Icon Clicked - AutoSave - Not Saved',
            eventLabel: q,
          },
        });
      }
    } catch (err) {
      const dialog: Dialog = {
        behavior: { autoHide: true, hideTimeout: 4000 },
        message: {
          title: 'Ops!',
          text: `Something went wrong. Please try again later`,
          image: { url: getRandomErrorGif() },
        },
      };

      chrome.runtime.sendMessage({
        type: 'showDialog',
        data: dialog,
      });

      chrome.runtime.sendMessage({
        type: 'addIconClicked',
        data: {
          pageName: 'YouTube',
          eventCategory: 'YouTube Video',
          eventAction: 'Spotify Icon Clicked - AutoSave - Error',
          eventLabel: q,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  const autoSaveStarted = async (query: string) => {
    const token = await getSpotifyToken();
    if (token) {
      searchAndSave(query);
      chrome.runtime.sendMessage({
        type: 'addIconClicked',
        data: {
          pageName: 'YouTube',
          eventCategory: 'YouTube Video',
          eventAction: 'Spotify Icon Clicked - AutoSave',
          eventLabel: query,
        },
      });
    } else {
      openAuth();
      chrome.runtime.sendMessage({
        type: 'addIconClicked',
        data: {
          pageName: 'YouTube',
          eventCategory: 'YouTube Video',
          eventAction: 'Spotify Icon Clicked - AutoSave - Login',
          eventLabel: query,
        },
      });
      // const tokenAfterFirstLogin = await waitAndGetFirstLoginResponse();
      // if (tokenAfterFirstLogin) {
      //   searchAndSave(query);
      // }
    }
  };

  const OpenInContentStarted = () => {
    alert('This functioanality will be coming soon');
  };

  const onClickSpotifyIcon = async (query: string) => {
    const spotifyOption: string = await getSpotifyOption();

    switch (spotifyOption) {
      case SpotifyOption.AutoSave:
        autoSaveStarted(query);
        break;
      case SpotifyOption.OpenInContent:
        OpenInContentStarted();
        break;
      default:
        openAndSearchInSpotify(query);
        break;
    }
  };

  const openAndSearchInSpotify = (query: string): void => {
    window.open(getSpotifySearchUrl(query), '_blank');
    chrome.runtime.sendMessage({
      type: 'addIconClicked',
      data: {
        pageName: 'YouTube',
        eventCategory: 'YouTube Video',
        eventAction: 'Spotify Icon Clicked - Open&Search',
        eventLabel: query,
      },
    });
  };

  const showNoTitle = () => {
    const dialog: Dialog = {
      behavior: { autoHide: true },
      message: {
        title: 'Title Not Found',
        text: `No played song/video clip found.`,
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const addAll = async (data: any) => {
    try {
      const url = getAddTracksUrl();
      setIsSaving(true);
      const response = await axios.post(url, {
        id: data.id,
        type: data.type,
      });
      if (response.data?.data?.message === 'OK') {
        const { data: dataResponse } = response.data;
        const { trackIds, playlistUrl } = dataResponse;
        saved(trackIds, playlistUrl);
        chrome.runtime.sendMessage({
          type: 'addIconClicked',
          data: {
            pageName: 'YouTube',
            eventCategory: 'YouTube Video',
            eventAction: 'Spotify Icon Clicked - AutoSave - Multi - Saved',
            eventLabel: data.name, //playlist name
          },
        });
      } else {
        notSaved();
        chrome.runtime.sendMessage({
          type: 'addIconClicked',
          data: {
            pageName: 'YouTube',
            eventCategory: 'YouTube Video',
            eventAction: 'Spotify Icon Clicked - AutoSave - Multi - Not Saved',
            eventLabel: data.name, //playlist name
          },
        });
      }
    } catch (err) {
      const dialog: Dialog = {
        behavior: { autoHide: true, hideTimeout: 4000 },
        message: {
          title: 'Ops!',
          text: `Something went wrong. Please try again later`,
          image: { url: getRandomErrorGif() },
        },
      };

      chrome.runtime.sendMessage({
        type: 'showDialog',
        data: dialog,
      });

      chrome.runtime.sendMessage({
        type: 'addIconClicked',
        data: {
          pageName: 'YouTube',
          eventCategory: 'YouTube Video',
          eventAction: 'Spotify Icon Clicked - AutoSave - Multi - Error',
          eventLabel: data.name,
        },
      });
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    interceptAxios();
    chrome.runtime.onMessage.addListener(function (
      event,
      sender,
      sendResponse,
    ) {
      if (event.type == 'dialogAddAll') {
        addAll(event.data);
      }
    });
  }, []);

  return (
    <>
      <button
        id="paradify"
        className="spotify-button-in-yt-player playerButton ytp-button"
        onClick={() => {
          const trackInfo = paradify.getTrackInfo(location.href);
          const query = getSearchTextFromTrackInfo(trackInfo.track);
          if (query.length === 0) {
            showNoTitle();
            return;
          } else {
            onClickSpotifyIcon(query);
          }
        }}
        disabled={isSaving}
        draggable="false"
        title="Add to Spotify"
      >
        <div className="div-spotify-icon">
          {isSaving ? (
            <img
              src={chrome.runtime.getURL(loading)}
              width="100%"
              height="100%"
              title="Saving"
              className="img-spotify-icon"
            />
          ) : (
            <img
              src={chrome.runtime.getURL(spotifyImageUrl)}
              width="100%"
              height="100%"
              title="Add to Spotify"
              className="img-spotify-icon"
            />
          )}
        </div>
      </button>
    </>
  );
};

export default SpotifyIconInYouTube;
