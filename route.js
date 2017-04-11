var Index = require('./app/controllers/index');
var multipart = require('connect-multiparty');
var fs = require('fs');
var trim = require('trim');
var path = require('path');
var _ = require('lodash');

var multipartMiddleware = multipart();


module.exports = function(app){
  //pre handle user
  app.use(function(req, res, next){
    app.locals.message = req.session.message;
    if (req.method === 'GET') {
      req.session.message = '';
    }
    next();
  })

  // index page
  app.get('/', Index.index);
  app.get('/index', Index.index);

  app.post('/uploadXls', multipartMiddleware, Index.save);

  app.get('/demofiles/:fileName', Index.demofiles);

  app.get('/download', Index.download);
}