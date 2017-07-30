/*
exports.module = function(req, res, next){

};*/

module.exports = {
  checkLogin: function checkLogin(req, res, next){
    if(!req.session.login){
      return res.redirect('/admin/login');
    }
    next();
  },
  checkNotLogin: function(req, res, next){
    if(req.session.login){
      return res.redirect('/admin/posts');
    }
    next();
  }
}


