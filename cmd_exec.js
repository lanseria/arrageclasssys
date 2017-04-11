#!/usr/bin/env node
var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var XLSX = require('xlsx');
var iconv = require("iconv-lite");

var row = 4;
var col = 5;
var many = 3;
// var arg1 = './excel'
var arg2 = row+' '+col+' '+many;
var matlab = null;
// var cmdstr = 'python zc.py '+ arg1+' \n'+arg2;
fs.readdir(path.join(__dirname+'/excel/'), function(err, files){
  let error;
  if (err) {
    error = err;
  }
  if (!files.length) {
    error = 'No files to show!';
  }
  if (error) {
    return ;
  }
  matlab = arg2+'\n';
  files.forEach(function(file){
    matlab += file.split('.')[0]+'\n';
    var workbook = XLSX.readFile(__dirname+'/excel/'+file);
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var address_of_cell1 = 'B';
    var code = address_of_cell1.charCodeAt();
    for (var j = 2; j <=row+1; j++) {
      (function(j){
        for (var i = code; i <= code + col - 1; i++) {
          (function(i){
            var str2 = String.fromCharCode(i);
            var address_of_cell = str2+j;
            // console.log(address_of_cell);
            var desired_cell = worksheet[address_of_cell];
            var desired_value = (desired_cell ? desired_cell.v : 0);
            matlab += desired_value+' ';
          })(i);
        }
        // if (j !=row+1) {
          matlab += '\n';
        // }
      })(j);
    }
  })
  fs.writeFile('./tmp2.txt', iconv.encode(matlab, 'gbk'), null, function(err){
    if(err) throw err;
    console.log('It\'s saved!');
    exec('allot.exe < tmp2.txt > results.txt', function(err, stdout, stderr){
      if (err) throw err;
      else {
        fs.readFile('./results.txt', function(err, data){
          var str = iconv.decode(data, 'gbk');
          // console.log(str);
          var strarr = str.split(/\r?\n/ig);
          var _headers = ['No', 'Mon', 'Tue', 'Wed', 'Thu','Fri','Sat','Sun'];
          var data = [];
          for (var i = 1; i <= row; i++) {
            (function(i){
              var h = strarr[i].split(/,/);
              console.log(h[0],h[1],h[2],h[3],h[4],h[5]);
              var _data = { No: i,
                            Mon: h[0],
                            Tue: h[1],
                            Wed: h[2],
                            Thu: h[3],
                            Fri: h[4],
                            Sat: h[5],
                            Sun: '暂时无',
                           };
              data.push(_data);
            })(i);
          }
          console.log(data);
          var headers = _headers
            .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
            .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
          var data = data
            .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
            .reduce((prev, next) => prev.concat(next))
            .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
          var output = Object.assign({}, headers, data);
          var outputPos = Object.keys(output);
          var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
          var wb = {
              SheetNames: ['mySheet'],
              Sheets: {
                  'mySheet': Object.assign({}, output, { '!ref': ref })
              }
          };
          XLSX.writeFile(wb, 'output.xlsx');
        });
      }
    })
  });
})