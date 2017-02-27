import {createStore} from 'redux';
import {connect, Provider } from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';

let initState = {queryTip:'等待查询',
            data:[
                // {selected:false, sid:'iat183df5ff@gz015c0bf728243c3e00', rawText:'最强', time:'2017-02-09 11:04:04',
                // city:'广东-深圳', ip:'14.20.89.76', hasVoice:'', nlp:[]},
                // {selected:false, sid:'iat183df4ff@gz015c0bf728243c3e00', rawText:'最强', time:'2017-02-09 11:04:04',
                // city:'广东-深圳', ip:'14.20.89.76', hasVoice:'', nlp:[]},
                // {selected:false, sid:'iat183df3ff@gz015c0bf728243c3e00', rawText:'最强', time:'2017-02-09 11:04:04',
                // city:'广东-深圳', ip:'14.20.89.76', hasVoice:'', nlp:[]}
                ],
            selectAll:false};


// {"recEnd":1486609445759,"senseEnd":1486609445839,"mscInit":0.5,"zsyNetTime":71,"pointLastVoice":943,"pointStart":942,"recStart":1486609445679,"pointEnd":1134}
/**
let A_selectAll = {type:'selectAll', value:true};
let A_data_new = {type:'newData', value:[]};
let A_data_select_change = {type:'selectChange', value:true, sid:''};
let A_tip_change = {type:'tipChange', value:''};
let A_query_nlp_result = {type:'nlpQueryResult', sid: '', value:{focus:'video', object:''}};
**/

function reduceData(state=[], action){
    let nextState;
    switch(action.type){
        case 'newData':
            nextState = action.value;
            break;
        case 'selectChange':
            nextState = state.slice()
            for(var i in nextState){
                if(nextState[i].sid === action.sid){
                    let dataItem = Object.assign({}, nextState[i], {selected:action.value});
                    nextState[i] = dataItem;
                    break;
                }
            }
            break;
        case 'nlpQueryResult':
            nextState = state.slice();
            for(var i in nextState){
                if(nextState[i].sid === action.sid){
                    let dataItem = Object.assign({}, nextState[i], {nlp:action.value});
                    nextState[i] = dataItem;
                    break;
                }
            }
            break;
        default:
            nextState = state;
    }
    return nextState;
}

function rootReducer(state=initState, action){
    console.log('receieve action :');

    let nextData = reduceData(state.data, action);
    let nextSelectAll = {};
    let nextTip = {};


    switch(action.type){
        case 'selectAll':
            nextSelectAll = {selectAll: action.value};
            for(let iterate in nextData){
                nextData[iterate].selected = action.value;
            }
            break;
        case 'tipChange':
            nextTip = {queryTip:action.value};
            break;
        default:
            break;
    }
    let nextState = Object.assign({}, state, {data:nextData}, nextSelectAll, nextTip);
    // console.dir(nextState);
    return nextState;
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
        </Provider>
        , rootElement);

    hook.getOutData = function(){
        return store.getState();
    }
}

export default bindStore;
