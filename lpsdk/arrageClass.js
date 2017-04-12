var exec = require('child_process').exec;
var fs = require('fs');
var path = require('path');
var XLSX = require('xlsx');
var iconv = require("iconv-lite");

/**
 * lpSDK arrage class.
 * @param {Object} options, must set `row`, `col` and `many`.
 * @constructor
 */

function ArrageClass(options) {
  if (!(this instanceof ArrageClass)) {
    return new ArrageClass(options);
  }
  options = options || {};
  if (!options.row || !options.col || !options.many) {
    throw new Errow('row , col or many need!');
  }
  this.row = options.row;
  this.col = options.col;
  this.many = options.many;
}
ArrageClass.prototype.writexlsx = function(data, strarr, callback) {
  var cb = this.row;
  for (var i = 1; i <= this.row; i++) {
    (function(i){
      var h = strarr[i].split(/\s/);
      //console.log(h[0],h[1],h[2],h[3],h[4],h[5]);
      var _data = { No: i,
                    Mon: h[0],
                    Tue: h[1],
                    Wed: h[2],
                    Thu: h[3],
                    Fri: h[4],
                    Sat: h[5],
                    Sun: h[6],
                   };
      data.push(_data);
      // console.log(data);
      if (i==cb) {
        callback(null, data);
      }
    })(i);
  }
};
ArrageClass.prototype.readxlsx = function(matlab, files, commonpath, callback) {
  var that = this;
  files.forEach(function(file){
    matlab += file.split('.')[0]+'\n';
    var workbook = XLSX.readFile(commonpath+file);
    var first_sheet_name = workbook.SheetNames[0];
    var worksheet = workbook.Sheets[first_sheet_name];
    var address_of_cell1 = 'B';
    var code = address_of_cell1.charCodeAt();
    var cb = String.fromCharCode(code + that.col - 1)+(that.row+1);
    for (var j = 2; j <=that.row+1; j++) {
      (function(j){
        for (var i = code; i <= code + that.col - 1; i++) {
          (function(i){
            var str2 = String.fromCharCode(i);
            var address_of_cell = str2+j;
            var desired_cell = worksheet[address_of_cell];
            var desired_value = (desired_cell ? desired_cell.v : 0);
            matlab += desired_value+' ';
            if (address_of_cell==cb&&files[files.length-1]==file) {
              callback(null, matlab);
            }
          })(i);
        }
        matlab += '\n';
      })(j);
    }
  })
};
ArrageClass.prototype.execute = function(callback) {
  var matlab = null;
  var argv = this.row+' '+this.col+' '+this.many;
  var commonpath = path.join(__dirname, '../public/upload/');
  var commonpath1 = path.join(__dirname, '../public/result_xlsx/');
  var that = this;
  fs.readdir(commonpath, function(err, files){
    let error;
    if (err) {
      error = err;    }
    if (!files.length) {
      error = 'No files to show!';
    }
    if (error) {
      return callback(error);
    }
    matlab = argv+'\n';
    that.readxlsx(matlab, files, commonpath, function(err, matlab){
      // console.log(matlab);
      fs.writeFile('./tmp.txt', iconv.encode(matlab, 'gbk'), null, function(err){
        if(err) return callback(err);
        console.log('It\'s saved!');
        var cmd = null;
        if (process.platform=='win32') {
          cmd = 'allot.exe < tmp.txt > results.txt';
        }
        if (process.platform=='linux') {
          cmd = './allot.out < tmp.txt > results.txt';
        }
        exec(cmd, function(err, stdout, stderr){
          if (err) return callback(err);
          else {
            fs.readFile('./results.txt', function(err, data){
              var str = iconv.decode(data, 'gbk');
              var strarr = str.split(/\r?\n/ig);
              var _headers = ['No', 'Mon', 'Tue', 'Wed', 'Thu','Fri','Sat','Sun'];
              var data = [];
              that.writexlsx(data, strarr, function(err, mdata){
                console.log(mdata);
                var headers = _headers
                  .map((v, i) => Object.assign({}, {v: v, position: String.fromCharCode(65+i) + 1 }))
                  .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
                var mdata = mdata
                  .map((v, i) => _headers.map((k, j) => Object.assign({}, { v: v[k], position: String.fromCharCode(65+j) + (i+2) })))
                  .reduce((prev, next) => prev.concat(next))
                  .reduce((prev, next) => Object.assign({}, prev, {[next.position]: {v: next.v}}), {});
                var output = Object.assign({}, headers, mdata);
                var outputPos = Object.keys(output);
                var ref = outputPos[0] + ':' + outputPos[outputPos.length - 1];
                var wb = {
                    SheetNames: ['mySheet'],
                    Sheets: {
                        'mySheet': Object.assign({}, output, { '!ref': ref })
                    }
                };
                XLSX.writeFile(wb, commonpath1+'output.xlsx');
                callback(null, commonpath1+'output.xlsx');
              })
            });
          }
        })
      });
    });
  });
};

exports.ArrageClass = ArrageClass;