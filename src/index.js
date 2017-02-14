import 'core-js/fn/object/assign';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/main';

// Render the main component into the dom
// ReactDOM.render(<App />, document.getElementById('app'));

function faceOn(containerEle) {
    ReactDOM.render(<App/>, containerEle);
}


let index = {};
index.faceOn = faceOn;
window.index = index;

// module.exports = index;
