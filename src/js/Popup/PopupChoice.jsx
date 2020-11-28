import React, { useEffect } from 'react';
import Header from './Header';

function PopupChoice() {
  useEffect(() => {
    // start();
  }, []);

  // const addClickChoice = (choiceName) => {};

  const renderHeader = () => {
    return (
      <>
        <Header />
        <div>
          <h3>Do you prefer to use paradify? or </h3>
          <div>
            <button
              className="gree-add-button text-white font-semibold 
                            rounded-full w-16 h-6 focus:outline-none focus:shadow-outline
                            transition duration-500 ease-in-out transform hover:-translate-1 hover:scale-110"
              onClick={() => {
                // onClickChoice('paradify-popup');
              }}
            >
              Add
            </button>
            <button
              className="gree-add-button text-white font-semibold 
                            rounded-full w-16 h-6 focus:outline-none focus:shadow-outline
                            transition duration-500 ease-in-out transform hover:-translate-1 hover:scale-110"
              onClick={() => {
                // onClickChoice('direct-open');
              }}
            >
              Add
            </button>
          </div>
        </div>
      </>
    );
  };

  return <>{renderHeader()}</>;
}

export default PopupChoice;
