require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';

let yeomanImage = require('../images/123.jpg');

class MainComponent extends React.Component {
  render() {
    return (
      <div className="index">
        <div>我很好2323</div>
<img src={yeomanImage} alt="Yeoman Generator" />
        <div className="notice">Please edit <code>src/components/Main.js</code> to get started!</div>
      </div>
    );
  }
}

MainComponent.defaultProps = {
};

export default MainComponent;
