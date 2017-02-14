import { createStore } from 'redux';
import {connect, Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

//state
let initState = { currPos:-1, chapterData:[ {type:1, value:''} ] };

//actions
let action_posChange = {type:'posChange', position:-1};
let action_addItem = {type:'addItem', itemType:1, position:-1};
let action_valueChange = {type:'valueChange', value:'', position:-1};

//reducers
function rootReducer(state = initState, action){
    let nextState = Object.assign({}, state);
    let chapterData = state.chapterData.slice();

    console.log('receieve action:');
    console.log(action);
    switch(action.type){
        case 'posChange':
            nextState.currPos = action.position;
            return nextState;
        case 'addItem':
            if(state.currPos === -1){
                chapterData.push({type:action.itemType, value:''});
            }
            else {
                chapterData.splice(state.currPos + 1, 0, {type:action.itemType, value:''})
            }
            nextState.chapterData = chapterData;
            return nextState;
        case 'valueChange':
            chapterData[action.position].value = action.value;
            nextState.chapterData = chapterData;
            return nextState;
        default:
            return state;
    }
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
    let MyEditor = connect(mapStateToProps, mapDispatchToProps)(objElement);
    let editor = <MyEditor />;

    initState.chapterData = hook.initData;
    let store = createStore(rootReducer);

    ReactDOM.render(
        <Provider store={store}>
            {editor}
        </Provider>, rootElement);

    hook.getOutData = function(){
        return store.getState();
    }
}

export default bindStore;
