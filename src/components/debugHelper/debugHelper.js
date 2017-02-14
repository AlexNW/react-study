import React from 'React';
import bindStore from './redux-store.js';

require("styles/debugHelper/main.scss");

function TextInput(props){
    return (
        <div>
            <label>{props.tipText}</label>
            <input type="text" id={props.tag} name={props.tag} placeholder={props.defaultText} />
        </div>
        );
}

class QueryBar extends React.Component{
    constructor(props){
        super(props);
        this.query = this.query.bind(this);
    }

    query(){
        console.log("submit ...");
        // console.log('--->' + this.refs.uidInput.value);

    }

    render(){
        return (
            <div id='query-form' >
                <TextInput tag="uid" defaultText='请填写UID' tipText='UID' ref="queryBar" />
                <TextInput tag="uid" defaultText='请填写UID' tipText='Start时间' />
                <TextInput tag="uid" defaultText='请填写UID' tipText='End时间' />

                <button type="button" onClick={this.query}>查询</button>

                <div>
                    <input id="sid" type="text" name="sid" placeholder="优先查询Sid"/>
                    <label>Sid</label>
                </div>
            </div>
        );
    }
}


class DebugHelper extends React.Component {

    haha(){

    }

    render(){
        return (
            <div>
                <div id="header">Debug Helper</div>
                <QueryBar sendAction={this.props.sendAction}/>

            </div>

        );
    }
}

DebugHelper.putInto = function(rootElement, hook){
    bindStore(DebugHelper, rootElement, hook);
}

module.exports = DebugHelper;
