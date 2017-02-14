let glob = require('glob');
let path = require('path');
// let pathnow = path.join(__dirname, '../*?/?***.js');
// console.log("-->" + pathnow);

// let files = glob.sync(pathnow);

// for (var i = 0; i < files.length; i++) {

//     console.log("--->" + files[i]);
// }


let array1 = [1,2,3,4,5,6];

console.log(array1);

let array2 = array1.splice(6,0,15);

console.log(array1);

