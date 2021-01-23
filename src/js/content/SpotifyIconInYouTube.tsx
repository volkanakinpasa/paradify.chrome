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
} from '../utils';
import { getPlaylistUrl, getRefreshUrl } from '../utils/constants';
import { Dialog, Token } from '../interfaces';

import './content.css';
import { SpotifyOption } from '../enums';

const { getSpotifyToken, getSpotifyOption } = storageUtil;

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

  const saved = (trackIds: string[] = [], playlistUrl: string) => {
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
        imgUrl: getRandomSuccessGif(),
        url: playlistUrl,
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const notSaved = () => {
    const dialog: Dialog = {
      behavior: { autoHide: true },
      message: {
        title: 'Not Found',
        text: `The video was not found in Spotify.`,
        imgUrl: getRandomFailedGif(),
      },
    };

    chrome.runtime.sendMessage({
      type: 'showDialog',
      data: dialog,
    });
  };

  const searchAndSave = async (q: string) => {
    try {
      const url = getPlaylistUrl();
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
      } else {
        notSaved();
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
          imgUrl: getRandomErrorGif(),
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
      setTimeout(() => {
        setIsSaving(false);
      }, 400);
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

  useEffect(() => {
    interceptAxios();
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
