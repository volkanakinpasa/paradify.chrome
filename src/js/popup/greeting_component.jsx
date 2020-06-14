import React, { useEffect } from 'react';
import { hot } from 'react-hot-loader';
import Test from './Test';
import '../../css/index.css';

class GreetingComponent extends React.Component {
  render() {
    return (
      <div className='antialiased font-mono text-gray-300'>
        <div className='mx-auto px-4'>
          <Test />
        </div>
      </div>
    );
  }
}

export default GreetingComponent;
