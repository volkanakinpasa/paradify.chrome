import React, { FC, useEffect, useState } from 'react';
// import { storageUtil } from '../../utils';
import { TIMEOUT_MS } from '../../utils/constants';

import classNames from 'classnames';
import paradifyLogo from '../../../img/paradify_logo.png';
import dialogClose from '../../../img/dialog_close.png';

import './dialog.css';
import { Dialog, DialogBehavior } from '../../interfaces';

// const { getToken, getSpotifyOption } = storageUtil;

const ModalDialogInYouTube: FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      event,
      sender,
      sendResponse,
    ) {
      if (event.type === 'showDialog') {
        setDialog(event.data);
        if (event.data.behavior.autoHide) {
          setTimeout(() => {
            setShowDialog(false);
          }, event.data.behavior.hideTimeout || TIMEOUT_MS);
        }
        setShowDialog(true);
      }
    });
  }, []);

  const close = () => {
    setShowDialog(false);
    setDialog(null);
  };

  const renderClose = (behavior: DialogBehavior) => {
    if (!behavior.autoHide) {
      return (
        <button className="p-d-btn-close" onClick={() => close()}>
          <img
            src={chrome.runtime.getURL(dialogClose)}
            height="10"
            width="10"
            className="p-d-ml-1"
          />
        </button>
      );
    }
    return null;
  };

  return (
    <>
      {showDialog && (
        <div
          className={classNames(
            { 'p-d-paradify-dialog-in-youtube-show': showDialog },
            { 'p-d-paradify-dialog-in-youtube-hide': !showDialog },
          )}
        >
          {dialog && dialog.message && (
            <>
              <div
                className={classNames(
                  'p-d-paradify-dialog-in-youtube-inner',
                  'p-d-mx-auto p-d-px-4 p-d-py-4',
                )}
              >
                <div className="p-d-flex p-d-items-center p-d-mx-auto p-d-justify-between">
                  <div className="p-d-flex p-d-items-center">
                    <img
                      src={chrome.runtime.getURL(paradifyLogo)}
                      height="20"
                      width="29"
                      className="p-d-ml-1"
                    />
                    <div className="p-d-ml-4 p-d-text-2xl">
                      {dialog.message.title}
                    </div>
                  </div>
                  <div>{renderClose(dialog.behavior)}</div>
                </div>
              </div>

              {dialog.message.imgUrl && (
                <div
                  className={classNames(
                    'p-d-paradify-dialog-in-youtube-inner',
                    'p-d-mx-auto p-d-px-4 p-d-py-4',
                    'p-d-items-center p-d-py-2 p-d-text-xl p-d-text-center p-d-mt-10',
                  )}
                >
                  <img className="p-d-w-full" src={dialog.message.imgUrl} />
                </div>
              )}
              <div
                className={classNames(
                  'p-d-paradify-dialog-in-youtube-inner',
                  'p-d-mx-auto p-d-px-4 p-d-py-4',
                  'p-d-items-center p-d-py-2 p-d-text-xl p-d-text-center p-d-mt-10',
                )}
              >
                {dialog.message.text}
                {dialog.message.url && (
                  <>
                    <div className="p-d-mt-10">
                      Click{' '}
                      <a
                        href={dialog.message.url}
                        className="p-d-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        here
                      </a>{' '}
                      to open
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default ModalDialogInYouTube;
