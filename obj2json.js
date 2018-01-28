#!/usr/bin/env node

/*        [0]     [1]           [2]          [3]      
Usage :  node obj2json.js something.obj something.mtl 
*/

var obj2json = require('./wavefront-obj-parser');
var fs = require('fs')
var path = require('path')

var filename = process.argv[2];
let mtlFile = process.argv[3];
let data;

// If a filename was specified, read it and write to stdout
if (filename) {
  var wavefrontString = fs.readFileSync(path.resolve(process.cwd(), filename)).toString('utf8')
  let mtlString = fs.readFileSync(path.resolve(process.cwd(), mtlFile)).toString('utf8');
  let parsedObj = obj2json(wavefrontString, mtlString);

  for(let i=0; i<parsedObj.length; i++) {
    data = JSON.stringify(parsedObj[i]);
    fs.writeFileSync(`a${i}.json`, data, 'utf-8');
  }

}
