import {createStore} from 'redux';
import {connect, Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

let initState = {};


function rootReducer(state=initState, action){
    return state;
}

function bindStore(objElement, rootElement, hook){
    let mapStateToProps = (state)=>{
        return state;
    };
    let mapDispatchToProps = (dispatch)=>{
        return {
            sendAction : (action)=>{
                dispatch(action);
            }
        };
    };
    let ConnectEle = connect(mapStateToProps, mapDispatchToProps)(objElement);

    initState.chapterData = hook.initData;
    let store = createStore(rootReducer);

    ReactDOM.render(
        <Provider store={store}>
            <ConnectEle />
        </Provider>, rootElement);

    hook.getOutData = function(){
        return store.getState();
    }
}

export default bindStore;
