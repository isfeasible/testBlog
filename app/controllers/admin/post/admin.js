var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  crypto = require('../../../../utils/crypto.js'),
  checkLogin = require('../../../../utils/access_control.js').checkLogin,
  checkNotLogin = require('../../../../utils/access_control.js').checkNotLogin,
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/admin', router);
};

router.get('/', checkLogin, function (req, res, next) {
  return res.redirect('/admin/login');
});

router.get('/login', checkNotLogin, function(req, res, next){
  res.render('admin/login',{
    '_error': ''
  });
});

router.post('/login', checkNotLogin, function(req, res, next){
  var crypted = crypto(req.body.password);

  var conditions = {};
  conditions.username = req.body.username;

  User.findOne(conditions)
    .exec(function (err, user) {
      if (err) return next(err);

      if(crypted == user.passwd){
        req.session.login = true;
        res.redirect('/admin/posts');
      }else{
        res.render('admin/login',{
          '_error': '密码或者用户名错误'
        });
      }

    });
});

router.get('/loginout', checkLogin, function(req, res, next){
  req.session.login = false;
  return res.redirect('/posts');
});


