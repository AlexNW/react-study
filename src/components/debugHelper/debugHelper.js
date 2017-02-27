import React from 'React';
import bindStore from './redux-store.js';
import fetch from 'isomorphic-fetch';

require('styles/debugHelper/main.scss');
require('font-awesome/scss/font-awesome.scss');

function dataFormat(date) {
    var o = {
        'y' : date.getFullYear(),
        'M' : date.getMonth()+1,                 //月份
        'd' : date.getDate(),                    //日
        'h' : date.getHours(),                   //小时
        'm' : date.getMinutes(),                 //分
        's' : date.getSeconds(),                 //秒
        'q' : Math.floor((date.getMonth()+3)/3), //季度
        'S'  : date.getMilliseconds()             //毫秒
    };
    let formatString = o.y
            + '-' + (o.M < 10 ? '0' + o.M : o.M)
            + '-' + (o.d < 10 ? '0' + o.d : o.d)
            + ' ' + (o.h < 10 ? '0' + o.h : o.h)
            + ':' + (o.m < 10 ? '0' + o.m : o.m)
            + ':' + (o.s < 10 ? '0' + o.s : o.s);
    return formatString;
}

let hasClass = (function(){
    let div = document.createElement('div') ;
    if( 'classList' in div && typeof div.classList.contains === 'function' ) {
        return function(elem, className){
            return elem.classList.contains(className) ;
        } ;
    } else {
        return function(elem, className){
            let classes = elem.className.split(/\s+/) ;
            for(let i= 0 ; i < classes.length ; i ++) {
                if( classes[i] === className ) {
                    return true;
                }
            }
            return false ;
        } ;
    }
})() ;

class DownloadPanel extends React.Component{
    constructor(props){
        super(props);
        this.state = {wavState:'', logState:''};
    }

    downloadFile(e){
        let item = e.target;
        if(hasClass(item, 'downloading')){
            return;
        }
        item.className = item.className + ' downloading';
        var selectData = this.props.selected;

        if(selectData.length == 0){
            alert('请选择要下载的 SID');
            item.className = item.className.replace(' downloading', '');
            return;
        }
        let downType = item.attributes['type'].nodeValue;
        var postData = 'what=' + downType
                            + '&content=' + JSON.stringify(selectData);

        this.setState((downType === 'wav') ? {wavState:'打包中'} : {logState:'打包中'});
        fetch('/uidQuery/download', {method:'POST',
                                    headers: {
                                        'Content-Type':'application/x-www-form-urlencoded;charset=UTF-8'
                                    },
                                    body:postData})
            .then(response=>{
                return response.text();
            })
            .then(data=>{
                item.className = item.className.replace(' downloading', '');

                var result = JSON.parse(data);
                if(result.result === 'unLogin'){
                    alert('请登录');
                    return;
                }
                if(result.result === 'success'){
                    this.setState((downType === 'wav') ? {wavState:'已打包'} : {logState:'已打包'});
                    window.open(result.data, '_blank');
                }
                else if(result.result === 'fail'){
                    this.setState((downType === 'wav') ? {wavState:'打包失败'} : {logState:'打包失败'});
                    alert('' + result.msg);
                }
            })
            .catch(e=>{
                alert('网络请求错误 : ' + e.message);
                item.className = item.className.replace(' downloading', '');
                let state = (downType === 'wav') ? {wavState:'请求超时'} : {logState:'请求超时'};
                this.setState(state);
            });
    }

    render(){
        console.log(this.state);
        return (
            <div id='download-panel'>
                <div className='d-state up' id='d_wav_state'>{this.state.wavState}</div>
                <div className='d-operate' onClick={this.downloadFile.bind(this)} type='wav'>下载音频</div>
                <div className='d-operate' onClick={this.downloadFile.bind(this)} type='log'>下载日志</div>
                <div className='d-state down' id='d_log_state'>{this.state.logState}</div>
            </div>
            );
    }

}

class NlpShower extends React.Component {
    constructor(props){
        super(props);
    }

    prependTagName(ele){
        let childNodes = ele.childNodes;
        if(ele.nodeName === '#text' || childNodes.length === 0){
            return;
        }

        for(let i = 0; i < childNodes.length; i ++){
            this.prependTagName(childNodes[i]);
        }
        let tag = document.createElement('tag');
        tag.innerHTML = ele.nodeName;
        tag.className = 'nlp-tag';
        ele.insertBefore(tag, childNodes[0]);
    }

    render(){
        if(!this.props.dataNlp.show){
            return <div />;
        }

        let temp = document.createElement('div');
        temp.innerHTML = this.props.dataNlp.data;
        for(let i = 0; i < temp.childNodes.length; i ++){
            this.prependTagName(temp.childNodes[i]);
        }

        let shower = <div className='shower' dangerouslySetInnerHTML={{__html:temp.innerHTML}}></div>;

        return (
            <div id='nlp-shower' style={{right: this.props.dataNlp.x +'px', top: this.props.dataNlp.y + 'px'}}>
                <div className='close-btn' onClick={this.props.closeCb}><i className='fa fa-close'></i></div>
                {shower}
            </div>
            );
    }
}

class DataViewItem extends React.Component {
    constructor(props){
        super(props);
        this.state = {nlpState:'wait',perf:''};
        this.performanceQuery = this.performanceQuery.bind(this);
    }

    selectChange(e){
        this.props.sendAction({type:'selectChange', sid:this.props.dataItem.sid, value:e.target.checked});
    }

    voicePlay(e) {
        let voiceSpan = e.target;
        let audioEle = voiceSpan.getElementsByTagName('audio');
        if(audioEle.length > 0){
            audioEle[0].play();
            console.dir(audioEle[0]);
            return;
        }
        voiceSpan.innerHTML= 'Loading';

        fetch('uidQuery/play?sid=' + this.props.dataItem.sid)
        .then(response=>{
            return response.json();
        })
        .then(resultJo=>{
            if(resultJo.result == 'unLogin'){
                alert('请登录');
                return;
            }
            if(resultJo.result == 'success'){
                let audio = document.createElement('audio');
                audio.src = 'file_download/wavFile/' + this.props.dataItem.sid + '.wav';

                voiceSpan.innerHTML = 'Ready';
                voiceSpan.appendChild(audio);
                console.dir(audio);
                audio.play();

            }
            else if(resultJo.result == 'fail'){
                alert('' + resultJo.reason);
                voiceSpan.innerHTML = '加载失败';
                if(resultJo.retry == 1){
                    voiceSpan.innerHTML = '重新加载';
                }
            }
            else {
                voiceSpan.innerHTML = '请求失败';
            }
        })
        .catch((error)=>{
            voiceSpan.innerHTML = '请求失败';
        });
    }

    nlpOnHover(e){
        let nlpData = e.target.getAttribute('data');
        let parentNode = e.target.parentElement;

        this.props.showNlp(nlpData, parentNode.offsetLeft, parentNode.offsetTop);
    }

    nlpQuery(e){
        this.setState({nlpState:'query'});
        fetch('/uidQuery/nlp?sid=' + this.props.dataItem.sid).then(response=>{
            if(response.ok){
                return response.json();
            }
        })
        .then(result=>{
            this.props.sendAction({type:'nlpQueryResult', sid: this.props.dataItem.sid, value:result});
            this.setState({nlpState:'result'});
        })
        .catch(error=>{
            console.log(error);
            this.setState({nlpState:'error'});
        });
    }

    performanceQuery(e){
        this.setState({perf:'查询中'});
        fetch('/sid/performance?sid=' + this.props.dataItem.sid).then(response=>{
            return response.json();
        })
        .then(json=>{
            this.setState({perf:json});
        })
        .catch(e=>{
            this.setState({perf:'重试'});
            console.log('error:' + e.message);
        })
    }

    render(){
        let dataItem = this.props.dataItem;
        let nlpSpan = (<span className='has-data' onClick={this.nlpQuery.bind(this)}>
                        语义<i className='fa fa-search'></i>
                    </span>);
        if(this.state.nlpState === 'wait'){
        }
        else if(this.state.nlpState === 'query'){
            nlpSpan = '查询中';
        }
        else if(this.state.nlpState === 'result'){
            if(dataItem.nlp === undefined || dataItem.nlp.length === 0){
                nlpSpan = '无语义';
            }
            else{
                nlpSpan = dataItem.nlp.map((item, index)=>{
                    return (
                        <span className='nlp-focus' key={index} data={item.object} onMouseOver={this.nlpOnHover.bind(this)}>{item.focus}</span>);
                });
            }
        }
        else if(this.state.nlpState === 'error'){
            nlpSpan = (<span className='has-data' onClick={this.nlpQuery.bind(this)}>
                        查询超时，请重试<i className='fa fa-search'></i>
                    </span>);
        }
        let voiceSpan;
        if(dataItem.hasVoice){
            voiceSpan = <span className='fa fa-volume-up has-data' onClick={this.voicePlay.bind(this)}></span>
        }
        else{
            voiceSpan = <span className='fa fa-volume-up'></span>
        }

        let performanceSpan;
        if(this.state.perf === ''){
            performanceSpan = <span onClick={this.performanceQuery}>耗时查询<i className='fa fa-search'></i></span>;
        }
        else if(this.state.perf === '重试'){
            performanceSpan = <span onClick={this.performanceQuery}>重试<i className='fa fa-search'></i></span>;
        }
        else if(this.state.perf === '查询中'){
            performanceSpan = <span>查询中</span>;
        }
        else{
            let performance = this.state.perf;

            let voiceStart = performance.pointStart;
            let voiceEnd = performance.pointEnd;
            let voiceLast = performance.pointLastVoice;

            let costTimeAll = voiceEnd - voiceStart;
            let costTimeMscInit = performance.mscInit;
            let costTimeZsyNet = performance.zsyNetTime;
            let costTimeRecognize = performance.recEnd - performance.recStart;
            let costTimeNlp = performance.senseEnd - performance.recEnd;

            console.dir(performance);
            performanceSpan = <div className='perf-result'>响应时间:{costTimeAll}<br/>
                                    尾音频处理时长:{voiceLast - voiceStart}<br/>
                                    msc初始化:{costTimeMscInit}<br/>
                                    识别:{costTimeRecognize}<br/>
                                    语义:{costTimeNlp}<br/>
                                    知识云请求:{costTimeZsyNet}</div>;
        }

        return (
            <tr className={this.props.rowGroup}>
                <td className='result result-select'>
                    <input type='checkbox' checked={dataItem.selected ? true : false} onChange={this.selectChange.bind(this)}/>
                </td>
                <td className='result result-sid'>
                    <a href={'http://zhidao.voicecloud.cn/memsearch/query?sid=' + dataItem.sid}
                        target='_blank'>{dataItem.sid}</a>
                </td>
                <td className='result result-text'>{dataItem.rawText}</td>
                <td className='result result-time'>{dataItem.time}</td>
                <td className='result result-addr'>{dataItem.city}</td>
                <td className='result result-ip'>
                    {performanceSpan}
                </td>
                <td className='result result-voice'>
                    {voiceSpan}
                </td>
                <td className='result result-nlp'>
                    {nlpSpan}
                </td>
            </tr>
            );
    }
}

class DataPanel extends React.Component{
    constructor(props){
        super(props);
    }

    onSelectAllChange(e){
        this.props.sendAction({type:'selectAll', value:e.target.checked});
    }

    render(){
        let dataViews = this.props.data.map((dataItem, index) => {
            return (
                <DataViewItem key={dataItem.sid} dataItem={dataItem} sendAction={this.props.sendAction}
                    showNlp={this.props.showNlp} rowGroup={index%2 === 0 ? 'even' :'odd'}/>
                );
        });

        return (
            <table id='result-body' cellSpacing='0px'>
                <thead>
                    <tr id='result-title'>
                        <th className='result result-select'>
                            <input type='checkbox' checked={this.props.selectAll}
                                onChange={this.onSelectAllChange.bind(this)}/>
                        </th>
                        <th className='result result-sid'>sid</th>
                        <th className='result result-text'>转写结果</th>
                        <th className='result result-time'>时间</th>
                        <th className='result result-addr'>地点</th>
                        <th className='result result-ip'>耗时分析(ms)</th>
                        <th className='result result-voice'>音频 <i className='fa fa-file-audio-o'></i></th>
                        <th className='result result-nlp'>语义结果</th>
                    </tr>
                </thead>
                <tbody>
                    {dataViews}
                </tbody>
            </table> );
    }
}

class TextInput extends React.Component{
    render(){
        return (
            <div>
                <label>{this.props.labelText}</label>&nbsp;
                <input type='text' placeholder={this.props.tipText}
                        value={this.props.valueText} onChange={this.props.valueChange}/>
            </div> );
    }
}

class QueryBar extends React.Component{
    constructor(props){
        super(props);
        this.query = this.query.bind(this);

        let now = new Date();
        let startDay = new Date(now.getTime() - 3 * 24 * 3600 * 1000);
        this.state = {
            sid:'', uid:'',
            startTime: dataFormat(startDay),
            endTime: dataFormat(now)
        };
    }

    query(){
        let queryUrl = '/query';
        let queryTip = '';
        if(this.state.sid){
            queryUrl = queryUrl + '?sid=' + this.state.sid;
            queryTip = '查询 sid [' + this.state.sid + '] ,';
        }
        else {
            queryUrl = queryUrl + '?uid=' + this.state.uid + '&start=' + this.state.startTime + '&end=' + this.state.endTime;
            queryTip = '查询 uid [' + this.state.uid + '], ';
        }
        this.props.sendAction({type:'tipChange', value:queryTip + '请稍等...'});
        fetch(queryUrl).then(response=>{
            return response.json();
        })
        .then(result=>{
            let size = result.length;
            this.props.sendAction({type:'tipChange', value:queryTip + size + '条结果'});
            this.props.sendAction({type:'newData', value:result});
            // console.log(result);
        })
        .catch(error=>{
            console.dir(error);
        });
    }

    sidChange(e){this.setState({sid:e.target.value})}
    uidChange(e){this.setState({uid:e.target.value})}
    sTimeChange(e){this.setState({startTime:e.target.value})}
    eTimeChange(e){this.setState({endTime:e.target.value})}

    render(){
        return (
            <div id='query-form' >
                <TextInput labelText='UID'  tipText='请填写UID'
                        valueText={this.state.uid}       valueChange={this.uidChange.bind(this)}/>&nbsp;
                <TextInput labelText='Start时间' tipText='Start时间'
                        valueText={this.state.startTime} valueChange={this.sTimeChange.bind(this)}/>&nbsp;
                <TextInput labelText='End时间' tipText='End时间'
                        valueText={this.state.endTime}   valueChange={this.eTimeChange.bind(this)}/>&nbsp;
                <button type='button' onClick={this.query.bind(this)}>查询</button>&nbsp;
                <div>
                    <input type='text' placeholder='优先查询Sid' name='sid'
                        value={this.state.sid} onChange={this.sidChange.bind(this)}/>&nbsp;
                    <label>Sid</label>
                </div>
            </div>
        );
    }
}


class DebugHelper extends React.Component {
    constructor(props){
        super(props);
        this.getSelectedData = this.getSelectedData.bind(this);
        this.state = {nlp:{show:false, data:'', x:-1, y:-1}};
    }

    closeNlpShower(){
        this.setState({nlp:{show:false}});
    }

    showNlp(data,posX, posY){
        let yOffset = document.getElementById('result-body').offsetTop + posY;
        let xOffset = document.getElementById('result-body').offsetLeft + posX;
        let nextNlp = {data:data, x:document.body.offsetWidth - xOffset + 6, y:yOffset + 6, show:true};
        this.setState({nlp:nextNlp});
    }

    getSelectedData(){
        let selectedItems = [];
        let index = this.props.data.length
        for(let i = 0; i < index; i ++){
            let item = this.props.data[i];
            if(item.selected){
                selectedItems.push({sid:item.sid, text:item.rawText});
            }
        }
        return selectedItems;
    }

    render(){
        return (
            <div>
                <div id='header'>Debug Helper</div>
                <QueryBar sendAction={this.props.sendAction}/>
                <div id='query-tip'>{this.props.queryTip}</div>
                <DataPanel data={this.props.data} showNlp={this.showNlp.bind(this)}
                    selectAll={this.props.selectAll} sendAction={this.props.sendAction}/>
                <NlpShower dataNlp={this.state.nlp} closeCb={this.closeNlpShower.bind(this)}/>
                <DownloadPanel selected={this.getSelectedData()} />
            </div>
        );
    }
}

DebugHelper.putInto = function(rootElement, hook){
    bindStore(DebugHelper, rootElement, hook);
}

module.exports = DebugHelper;
