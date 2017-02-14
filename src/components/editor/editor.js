import React from 'react';
import bindStore from './redux-store.js';

require('styles/editor.scss');

class OperationBar extends React.Component{
    constructor(props){
        super(props);
        this.addSection = this.addSection.bind(this);
        this.addTitle = this.addTitle.bind(this);
    }

    addSection(){
        this.props.sendAction({type:'addItem', itemType:2, value:''});
    }

    addTitle(){
        this.props.sendAction({type:'addItem', itemType:1, value:''});
    }

    render(){
        return (
            <div className="opt-bar">
                <span onClick={this.addSection}>添加章节</span>
                <span onClick={this.addTitle}>添加标题</span>
            </div>
        );
    }
}

class ItemTitle extends React.Component {
    constructor(props){
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.focusChange = this.focusChange.bind(this);
    }

    onValueChange(event){
        this.props.sendAction({type:'valueChange', value:event.target.value, position:this.props.seq});
    }

    focusChange(){
        this.props.sendAction({type:'posChange', position:this.props.seq});
    }

    render(){
        return (
            <div>
                <input type="text" value={this.props.text} onChange={this.onValueChange} onFocus={this.focusChange} />
                <span>x</span>
            </div>
            );
    }
}

class ItemSection extends React.Component {
    constructor(props){
        super(props);
        this.onValueChange = this.onValueChange.bind(this);
        this.focusChange = this.focusChange.bind(this);
    }

    onValueChange(event){
        this.props.sendAction({type:'valueChange', value:event.target.value, position:this.props.seq});
    }


    focusChange(){
        this.props.sendAction({type:'posChange', position:this.props.seq});
    }

    render(){
        return (
            <div>
                <textarea value={this.props.text} onChange={this.onValueChange} onFocus={this.focusChange}/>
                <span>x</span>
            </div>);
    }
}

class EditArea extends React.Component {

    render(){
        let dataArray = this.props.chapterData ? this.props.chapterData : [];
        let contentList = dataArray.map((dataItem, index) => {
            if(typeof(dataItem) == 'undefined'){
                return;
            }
            if(dataItem.type === 1){
                return <ItemTitle key={index} text={dataItem.value} seq={index} sendAction={this.props.sendAction}/>;
            }
            else if(dataItem.type === 2){
                return <ItemSection key={index} text={dataItem.value} seq={index} sendAction={this.props.sendAction}/>;
            }
        });

        return (
            <div className="edit-area">
                {contentList}
            </div>
            );
    }
}

class Editor extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <div className="lib-editor">
                <OperationBar sendAction={this.props.sendAction} />
                <EditArea sendAction={this.props.sendAction} chapterData={this.props.chapterData} />
            </div>);
    }
}

Editor.putInto = function(parentElement, hook){
    bindStore(Editor, parentElement, hook);
}

module.exports = Editor;
