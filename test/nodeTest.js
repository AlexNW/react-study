let fetch = require('isomorphic-fetch');
let glob = require('glob');
let path = require('path');
// let pathnow = path.join(__dirname, '../*?/?***.js');
// console.log(\"-->\" + pathnow);

// let files = glob.sync(pathnow);

// for (var i = 0; i < files.length; i++) {

//     console.log(\"--->\" + files[i]);
// }


let array1 = [1,2,3,4,5,6];



console.dir(Object.assign(array1));

let array2 = array1.splice(6,0,15);

console.log(array1);

function dataFormat(date)
{ //author: meizz
  var o = {
    'y' : date.getFullYear(),
    "M" : date.getMonth()+1,                 //月份
    "d" : date.getDate(),                    //日
    "h" : date.getHours(),                   //小时
    "m" : date.getMinutes(),                 //分
    "s" : date.getSeconds(),                 //秒
    "q" : Math.floor((date.getMonth()+3)/3), //季度
    "S"  : date.getMilliseconds()             //毫秒
  };
  let formatString = o.y
         + '-' + (o.M < 10 ? '0' + o.M : o.M)
         + '-' + (o.d < 10 ? '0' + o.d : o.d)
         + ' ' + (o.h < 10 ? '0' + o.h : o.h)
         + ':' + (o.m < 10 ? '0' + o.m : o.m)
         + ':' + (o.s < 10 ? '0' + o.s : o.s)

  console.log(formatString);
}

let src = ['a', 'b', 'c', 'd'];

function method1(src){
    let dst = [];
    let bitSize = src.length;
    let size = 1 << bitSize;
    for(let i = 0; i < size; i ++){
        let item = '';
        for(let j = 0; j < bitSize; j ++){
            let index = (1 << j) & i;
            if(index > 0){
                item = item + src[j];
            }
        }
        if(item !== ''){
            dst.push(item);
        }
    }
    return dst;
}
function method2(src){
    function addElement(dstArray, ele){
        let length = dstArray.length;
        for(let i = 0; i < length; i ++){
            dstArray.push(dstArray[i] + ele);
        }
        dstArray.push(ele);
    }

    let dst = [];
    for(let i = 0; i < src.length; i ++){
        addElement(dst, src[i]);
    }
    return dst;
}

// let dst = method2(src);
// console.log(src.length + ' elements, src [' + src + ']');
// console.log(dst.length + ' collection, dst [' + dst + '], ');


let postBody = {what: "log", content: [{sid: "iat183df5ff@gz015c0bf728243c3e00", text: "最强"}]}
fetch("https://x.yuyin.tv/zhidao/uidQuery/download", {method:'POST', body:JSON.stringify(postBody)}).then(response=>{
    return response.text();
})
.then(data=>{
    console.log(data);
})
.catch(e=>{
    console.log(e);
})


