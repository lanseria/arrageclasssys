// var obj = {
//   step1:function(){
//     console.log('a');
//     return this;
//   },
//   step2:function(){
//     console.log('b');
//     return this;
//   },
//   step3:function(){
//     console.log('c');
//     return this;
//   },
//   step4:function(){
//     console.log('d');
//     return this;
//   }
// }
// obj.step1().step2().step3();
// var Promise = require('bluebird')
// var fs = Promise.promisifyAll(require("fs"));

// fs.readFileAsync("myfile.json").then(JSON.parse).then(function (json) {
//     console.log("Successful json");
// }).catch(SyntaxError, function (e) {
//     console.error("file contains invalid json");
// }).catch(Promise.OperationalError, function (e) {
//     console.error("unable to read file, because: ", e.message);
// });
// exports.a = function(){
//   console.log('a');
// }
// exports.a = 1;
// var child_process = require('child_process');
// var name = process.argv[2];
// child_process.exec('echo hello ' +name, function(err, stdout, stderr){
//   if (err) throw err;
//   console.log(stdout);
// });
// var XLSX = require('xlsx');
// var _headers = ['id', 'name', 'age', 'country', 'remark']
// var _data = [ { id: '1',
//                 name: 'test1',
//                 age: '30',
//                 country: 'China',
//                 remark: 'hello' },
//               { id: '2',
//                 name: 'test2',
//                 age: '20',
//                 country: 'America',
//                 remark: 'world' },
//               { id: '3',
//                 name: 'test3',
//                 age: '18',
//                 country: 'Unkonw',
//                 remark: 'hahaha' } ];
// var headers = _headers
//   .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
//   .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
// var data = _data
//   .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
//   .reduce((prev, next) => prev.concat(next))
//   .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
// var output = Object.assign({}, headers, data);
// var outputPos = Object.keys(output);
// var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
// var wb = {
//     SheetNames: ['mySheet'],
//     Sheets: {
//         'mySheet': Object.assign({}, output, { '!ref': ref })
//     }
// };
// XLSX.writeFile(wb, 'output.xlsx');
console.log(process.platform);