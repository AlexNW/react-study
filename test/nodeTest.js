let glob = require('glob');
let path = require('path');
let pathnow = path.join(__dirname, '../*?/?***.js');
console.log("-->" + pathnow);

let files = glob.sync(pathnow);

for (var i = 0; i < files.length; i++) {

    console.log("--->" + files[i]);
}


