var fs = require('fs');
var path = require('path');
var Member = require('../models/member');
var ArrageClass = require('../../lpsdk/arrageClass').ArrageClass;

exports.index = function(req, res){
  Member.fetch(function(err, members){
    res.render('index', {
      title: '排课系统',
      members: members, 
    });
  })
}

exports.demofiles = function(req, res){
  var fileName = req.params.fileName;
  var filePath = path.join(__dirname, '../../public/demo_xls/', fileName);
  console.log(filePath);
  var stats = fs.statSync(filePath);
  if (stats.isFile()) {
    res.set({
     'Content-Type': 'application/octet-stream',
     'Content-Disposition': 'attachment; filename='+fileName,
     'Content-Length': stats.size
    });
    fs.createReadStream(filePath).pipe(res);
  }
  else{
    res.end(404);
  }
}

exports.download = function(req, res){
  var client = new ArrageClass({
    'row': 6,
    'col': 5,
    'many': 100,
  })
  var suc = client.execute(function(err, suc){
    if (err) {console.log(err);}
    else{
      var fileName = 'output.xlsx';
      var filePath = path.join(suc);
      console.log(filePath);
      var stats = fs.statSync(filePath);
      if (stats.isFile()) {
        res.set({
         'Content-Type': 'application/octet-stream',
         'Content-Disposition': 'attachment; filename='+fileName,
         'Content-Length': stats.size
        });
        fs.createReadStream(filePath).pipe(res);
      }
      else{
        res.end(404);
      }
    }
  });
}


exports.save = function(req, res){
  var xlsFileData = req.files.uploadXls;
  var filePath = xlsFileData.path;
  var name = req.body.uploadName;
  var number = req.body.uploadNumber;
  var originalFilename = xlsFileData.originalFilename;
  if (originalFilename) {
    fs.readFile(filePath, function(err, data){
      console.log(xlsFileData.type);
      // var type = xlsFileData.type.split('/')[1];
      var type = 'xls'
      var xlsFile = name + '.' + type;
      var newPath = path.join(__dirname, '../../', '/public/upload/' + xlsFile);
      fs.writeFile(newPath, data, function(err){
        var member = new Member();
        member.name = name;
        member.number = number;
        member.save(function(err, member){
          return res.redirect('/index');
        })
      })
    })
  }
  else{
    return res.redirect('/index');
  }
}