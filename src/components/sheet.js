require('normalize.css/normalize.css');
require('styles/App.css');

import React from 'react';
import ReactDOM from 'react-dom';

let yeomanImage = require('../images/123.jpg');

class AppComponent extends React.Component {
  render() {

        var nihao = ['niming','wangwang', 'sanhao'];
    return (
      <div className="index" id="haha">
        <div>HHHH2</div>
        <img src={yeomanImage}></img>
            <p>{nihao[1]}</p>

      </div>

    );
  }
}

AppComponent.defaultProps = {

};

AppComponent.throwIn = function(element){
    ReactDOM.render(<AppComponent />, element);
}

module.exports = AppComponent;
