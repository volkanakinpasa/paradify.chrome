import { Token } from '../interfaces';
import {
  EXTENSION_INSTALLED,
  SPOTIFY_ICON_CLICK_ACTION_OPTION,
  SPOTIFY_TOKEN,
} from './constants';

const getStorage = async (key: string): Promise<any> =>
  new Promise<string>((resolve) => {
    chrome.storage.sync.get([key], (data) => {
      resolve(data[key]);
    });
  });

const setStorage = (key: string, value: any) => {
  new Promise<void>((resolve) => {
    chrome.storage.sync.set({ [key]: value }, () => {
      resolve();
    });
  });
};

const getSpotifyToken = async (): Promise<Token> =>
  await getStorage(SPOTIFY_TOKEN);
// new Promise<Token>((resolve) => {
//   chrome.storage.sync.get([SPOTIFY_TOKEN], (data) => {
//     resolve(data[SPOTIFY_TOKEN]);
//   });
// });

const setSpotifyToken = async (token: Token): Promise<void> =>
  await setStorage(SPOTIFY_TOKEN, token);

const getSpotifyOption = async (): Promise<string> =>
  await getStorage(SPOTIFY_ICON_CLICK_ACTION_OPTION);

const isInstalled = async (): Promise<boolean> => {
  const installedInfo: string = await getStorage(EXTENSION_INSTALLED);
  return installedInfo ? true : false;
};
const setIsInstalled = async (): Promise<void> =>
  await setStorage(EXTENSION_INSTALLED, 1);

const setSpotifyIconClickActionOption = async (option: string): Promise<void> =>
  await setStorage(SPOTIFY_ICON_CLICK_ACTION_OPTION, option);

const removeStorage = (key: string) => {
  new Promise<void>((resolve) => {
    chrome.storage.sync.remove(key, () => {
      resolve();
    });
  });
};

const removeSpotifyToken = async (): Promise<void> =>
  await removeStorage(SPOTIFY_TOKEN);

const removeSpotifyOption = async (): Promise<void> =>
  await removeStorage(SPOTIFY_ICON_CLICK_ACTION_OPTION);

const waitAndGetFirstLoginResponse = async () => {
  let token;

  for (let i = 0; i < 10; i++) {
    token = await new Promise<Token | null>((resolve) => {
      setTimeout(async () => {
        const tokenStorage: Token = await getSpotifyToken();
        if (tokenStorage) {
          resolve(tokenStorage);
        } else resolve(null);
      }, 3000);
    });

    if (token) {
      break;
    }
  }

  return token;
};

const storageUtil = {
  getSpotifyToken,
  getSpotifyOption,
  setSpotifyIconClickActionOption,
  setSpotifyToken,
  removeSpotifyToken,
  removeSpotifyOption,
  waitAndGetFirstLoginResponse,
  getStorage,
  setStorage,
  isInstalled,
  setIsInstalled,
};

export default storageUtil;
