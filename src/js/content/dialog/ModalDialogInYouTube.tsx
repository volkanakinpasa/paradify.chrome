import React, { FC, useEffect, useState } from 'react';
import classNames from 'classnames';
import paradifyLogo from '../../../img/paradify_logo.png';
import dialogClose from '../../../img/dialog_close.png';
import { Dialog, DialogBehavior } from '../../interfaces';
import { TIMEOUT_MS } from '../../utils/constants';
import './dialog.css';

const ModalDialogInYouTube: FC = () => {
  const [showDialog, setShowDialog] = useState(false);
  const [dialog, setDialog] = useState<Dialog>(null);

  // const onMouseOver = () => {
  //   console.log('over');
  //   clearTimeout(timeoutInterval);
  //   setTimeoutInterval(null);
  //   setShowDialog(true);
  // };

  // const onMouseOut = () => {
  //   console.log('out');
  //   clearTimeout(timeoutInterval);
  //   const timeout = setTimeout(() => {
  //     setShowDialog(false);
  //   }, 4000);
  //   setTimeoutInterval(timeout);
  // };

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    chrome.runtime.onMessage.addListener(function (
      event,
      sender,
      sendResponse,
    ) {
      if (event.type === 'showDialog') {
        setDialog(event.data);
        clearTimeout(timeout);
        if (event.data.behavior.autoHide) {
          timeout = setTimeout(() => {
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

  const addAll = (data: any) => {
    close();

    chrome.runtime.sendMessage({
      type: 'dialogAddAll',
      data,
    });
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

              {dialog.message.image && (
                <div
                  className={classNames(
                    'p-d-paradify-dialog-in-youtube-inner',
                    'p-d-mx-auto p-d-px-4 p-d-py-4',
                    'p-d-items-center p-d-py-2 p-d-text-xl p-d-text-center p-d-mt-5',
                  )}
                >
                  <img className="p-d-w-full" src={dialog.message.image.url} />
                </div>
              )}
              <div
                className={classNames(
                  'p-d-paradify-dialog-in-youtube-inner',
                  'p-d-mx-auto p-d-px-4 p-d-py-4',
                  'p-d-items-center p-d-py-2 p-d-text-xl p-d-line-h-22px p-d-text-center p-d-mt-5',
                )}
              >
                {dialog.message.text && dialog.message.text}
                {dialog.message.link && (
                  <>
                    <div className="p-d-mt-5">
                      <a
                        href={dialog.message.link.href}
                        className="p-d-link"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {dialog.message.link.text}
                      </a>
                    </div>
                  </>
                )}
                {dialog.confirmation && (
                  <>
                    <div>{dialog.confirmation.text}</div>
                    <div>
                      {' '}
                      <button
                        className="p-d-mt-5"
                        onClick={() => addAll(dialog.confirmation.data)}
                      >
                        Add All
                      </button>
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
