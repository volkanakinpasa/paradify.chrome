import React, { FC, useEffect, useState } from 'react';
import { render } from 'react-dom';
import { SpotifyOption } from '../enums';
import { Dialog, Token } from '../interfaces';
import { getRandomInstalledGif, storageUtil } from '../utils';
import '../../css/index.css';
import paradifyLogo from '../../img/paradify_logo.png';
import questionMark from '../../img/question_mark.png';
import ModalDialogInYouTube from '../content/dialog/ModalDialogInYouTube';
import ReactGA from 'react-ga';
import { initializeReactGA } from '../utils';
import GithubCorner from 'react-github-corner';
import launch from '../../img/launch.png';
import { URLS } from '../utils/constants';
const Option: FC = () => {
  const [tokenState, setTokenState] = useState<Token>(null);
  const [spotifyOptionState, setSpotifyOptionState] = useState(null);
  const [tooltipLogin, setTooltipLogin] = useState(false);
  const [tooltipHowAutoSaveWork, setTooltipHowAutoSaveWork] = useState(false);

  const loadStorageAndUpdateStates = async () => {
    const spotifyTokenData = await storageUtil.getSpotifyToken();

    setTokenState(spotifyTokenData);

    const spotifyOption: string = await storageUtil.getSpotifyOption();
    setSpotifyOptionState(spotifyOption);
  };

  const loadWelcomeMessage = async () => {
    const installed = await storageUtil.isInstalled();

    if (!installed) {
      const dialog: Dialog = {
        behavior: { autoHide: true, hideTimeout: 6000 },
        message: {
          title: 'You made it!',
          text: 'Enjoy using Paradify',
          image: { url: getRandomInstalledGif() },
        },
      };

      chrome.runtime.sendMessage({
        type: 'showDialog',
        data: dialog,
      });
      storageUtil.setIsInstalled();
    }
  };

  useEffect(() => {
    loadStorageAndUpdateStates();
    injectDialogWindow();
    loadWelcomeMessage();
    initializeReactGA(ReactGA, 'options');
  }, []);

  const saveOption = async (option: SpotifyOption) => {
    await storageUtil.setSpotifyIconClickActionOption(option);
    setSpotifyOptionState(option);
    ReactGA.event({
      category: 'Options',
      action: `Option Changed ${option.toString()}`,
      label: option.toString(),
    });
  };

  const logoutSpotify = async () => {
    await storageUtil.removeSpotifyToken();
    setTokenState(null);
    ReactGA.event({
      category: 'Options',
      action: 'Logout Clicked',
      label: '',
    });
  };

  const loginSpotify = async () => {
    chrome.runtime.sendMessage({
      type: 'openAuthRedirectUrl',
    });

    const token = await storageUtil.waitAndGetFirstLoginResponse();
    if (token) {
      setTokenState(token);
    }
  };

  const renderLoginContainer = () => {
    return (
      <>
        {tokenState && tokenState.access_token && (
          <div>
            You are logged in.{' '}
            <button className="underline" onClick={() => logoutSpotify()}>
              Logout
            </button>
          </div>
        )}
        {(!tokenState || !tokenState.access_token) && (
          <div>
            You are not logged in.{' '}
            <button className="underline" onClick={() => loginSpotify()}>
              Login
            </button>
          </div>
        )}
      </>
    );
  };

  const renderSpotifyIconActionClick_Option = () => {
    return (
      <>
        <div>
          <input
            type="radio"
            id="AutoSave"
            name="SpotifyOption"
            value="AutoSave"
            checked={spotifyOptionState === SpotifyOption.AutoSave}
            onChange={() => saveOption(SpotifyOption.AutoSave)}
            className="mr-2"
          />
          <label htmlFor="AutoSave">
            Auto Save (Recommended){' '}
            <div className="mt-2 text-gray-700">
              <p>
                Paradify adds tracks from YouTube to your Spotify playlist. So
                you can listen to it later. For this option you need to login in
                Spotify.
                <button
                  className="ml-2 underline"
                  onClick={() => {
                    setTooltipLogin(!tooltipLogin);
                    ReactGA.event({
                      category: 'Options',
                      action: 'Why Login Clicked',
                      label: '',
                    });
                  }}
                >
                  <img
                    src={questionMark}
                    alt="Why do I need to login?"
                    title="Why do I need to login?"
                    className="h-4 mr-1 inline"
                  />
                  Why login?
                </button>
                <button
                  className="ml-2"
                  onClick={() => {
                    setTooltipHowAutoSaveWork(!tooltipHowAutoSaveWork);
                    ReactGA.event({
                      category: 'Options',
                      action: 'How Does It Work Clicked',
                      label: '',
                    });
                  }}
                >
                  <div className="flex items-baseline underline">
                    How does it work?
                  </div>
                </button>
              </p>
              <p className=" mt-2 text-red-900">
                Be aware that Paradify cannot always find the tracks on Spotify
                due to the title of YouTube video. We do our best to filter and
                clean it before searching on Spotify.
              </p>
            </div>
            {tooltipLogin && (
              <>
                <div className="text-xs mt-2 ml-2">
                  You need to allow Paradify to add tracks into your playlist on
                  behalf of you. Note: Paradify does NOT collect any information
                  from your Spotify account. You can always remove the
                  permission under {'"Profile > Account > App"'}.
                </div>
              </>
            )}
            {tooltipHowAutoSaveWork && (
              <>
                <p className="text-xs mt-2 text-gray-700 ml-2">
                  Open a YouTube video. Click on the Spotify icon and the track
                  is added to your playlist immediately. Only the first time you
                  need to login and allow Paradify to add tracks into your
                  playlist on behalf of you.
                </p>
              </>
            )}
          </label>
        </div>
        <div className="mt-5">
          <input
            type="radio"
            id="OpenNewTab"
            name="SpotifyOption"
            value="OpenNewTab"
            checked={spotifyOptionState === SpotifyOption.OpenNewTab}
            onChange={() => saveOption(SpotifyOption.OpenNewTab)}
            className="mr-2"
          />
          <label htmlFor="OpenNewTab">
            Open and Search
            <p className="mt-2 text-gray-700">
              Paradify opens Spotify and finds tracks. It does not automatically
              add in your playlist.
            </p>
          </label>
        </div>
      </>
    );
  };

  const injectDialogWindow = () => {
    const dialogName = 'p-d-paradify-dialog-in-youtube';

    //Create dialog
    const dialog = window.document.createElement('div');
    dialog.className = dialogName;
    dialog.id = dialogName;

    window.document.body.appendChild(dialog);
    render(
      <ModalDialogInYouTube />,
      window.document.getElementById(dialogName),
    );
  };

  return (
    <>
      <div className="h-10 bg-blue-600 text-white w-full text-center flex items-center justify-center text-sm ">
        <img src={launch} className="mr-2" /> Paradify now supports Playlist
        search. You can add all tracks of Youtube video in your Spotify
        playlist.
      </div>
      <div className="max-w-700 mx-auto text-sm text-gray-800">
        <div className="my-5">
          <ul className="flex flex-wrap my-5">
            <li className="w-full sm:w-3/3 text-2xl flex items-center py-5 text-gray-600 border-dotted border-b">
              <img
                src={chrome.runtime.getURL(paradifyLogo)}
                className="mr-3 h-6"
              />
              Paradify - Options
            </li>

            <li className="w-full sm:w-1/3 py-5  border-dotted border-b border-t"></li>
            <li className="w-full sm:w-2/3 py-5  border-dotted border-b border-t">
              {renderLoginContainer()}
            </li>

            <li className="w-full sm:w-1/3 py-5 border-dotted border-b border-t">
              <div>Spotify Icon Action</div>
              <p className="text-xs mt-2 text-gray-700">
                When you click on Spotify icon in Youtube...
              </p>
            </li>
            <li className="w-full sm:w-2/3 py-5 border-dotted border-b border-t">
              <div>{renderSpotifyIconActionClick_Option()}</div>
            </li>

            <li className="w-full sm:w-1/3 py-5 border-dotted border-b border-t">
              <div>Feedback</div>
            </li>
            <li className="w-full sm:w-2/3 py-5 border-dotted border-b border-t">
              <div>
                Feel free to ask any{' '}
                <a
                  href="https://forms.gle/6V5hVCQhGxP6s9No7"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  question
                </a>{' '}
                or share any{' '}
                <a
                  href="https://forms.gle/6V5hVCQhGxP6s9No7"
                  target="_blank"
                  rel="noreferrer"
                  className="underline"
                >
                  feedback
                </a>{' '}
                with us
              </div>
            </li>
            <li className="w-full sm:w-1/3 py-5 border-dotted border-b border-t">
              <div>Github</div>
            </li>
            <li className="w-full sm:w-2/3 py-5 border-dotted border-b border-t">
              <div>
                Paradify is an open source chrome extension. Here is the
                repository{' '}
                <button
                  onClick={() => {
                    window.location.href =
                      'https://github.com/volkanakinpasa/youtubetospotify';
                    ReactGA.event({
                      category: 'Options',
                      action: 'Github - youtubetospotify',
                      label: '',
                    });
                  }}
                >
                  <div className="flex items-baseline underline">link</div>
                </button>
              </div>
            </li>
            <li className="w-full sm:w-1/3 py-5 border-dotted border-b border-t">
              <div>Donation</div>
            </li>
            <li className="w-full sm:w-2/3 py-5 border-dotted border-b border-t">
              <div>
                We need your Love, we need your support.{' '}
                <button
                  onClick={() => {
                    window.location.href = URLS.DONATION_PAYPAL;
                    ReactGA.event({
                      category: 'Options',
                      action: 'Donate Us Clicked',
                      label: '',
                    });
                  }}
                >
                  <div className="flex items-baseline underline">
                    Please Donate to Us
                  </div>
                </button>
              </div>
            </li>
          </ul>
          <div className="text-center text-xs ">
            <a href="https://www.paradify.com">paradify.com</a>
            <br />
            <br />
            <a href="http://www.youtube2spotify.com">youtube2spotify.com</a>
          </div>
        </div>
      </div>
      <GithubCorner href="https://github.com/volkanakinpasa/youtubetospotify" />
    </>
  );
};

export default Option;
