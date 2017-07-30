var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    Post = mongoose.model('Post'),
    checkLogin = require('../../../../utils/access_control.js').checkLogin,
    checkNotLogin = require('../../../../utils/access_control.js').checkNotLogin;

module.exports = function (app) {
    app.use('/admin/posts', router);
}

router.get('/', checkLogin, function (req, res, next) {
  Post.find({})
    .sort('-created')
    .exec(function (err, result) {
      if (err) return next(err);

      var posts = result.map(function(rawpost){
        var post = {};

        var data = rawpost.content;
        var index = data.indexOf('\r\n');
        post.title = data.slice(2, index);
        post.content = data.slice(index+2);
        post.created = rawpost.created;
        post._id = rawpost._id;

        return post;
      });
      res.render('admin/post/posts', {
        posts: posts,
        pretty: true
      });
  });
});

router.get('/add', checkLogin, function (req, res, next) {
  res.render('admin/post/add', {});
});

router.post('/add', checkLogin, function (req, res, next) {
  var data = req.body['test-editormd-markdown-doc'];

  var objRegExp = /^# .+\r\n(\r\n)*.+/;
  var panduan = objRegExp.test(data);
  if (!panduan) {
    return next(new Error("2-add-后台文章格式不对，提交失败"));
  }

  Post.create({
    "content": data,
    "created": new Date()
  }, function(err, result){
    if(err) return next(err);
    return res.redirect('/admin/posts');
  });
});


router.get('/edit/:id', checkLogin, function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('no post id provided'));
  }

  var conditions = {};
  conditions._id = mongoose.Types.ObjectId(req.params.id);

  Post.findOne(conditions)
    .exec(function (err, post) {
      if (err) return next(err);

      res.render('admin/post/edit', {
        post: post,
        pretty: true
      });
    });
});

router.post('/edit/:id', checkLogin, function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('no post id provided'));
  }

  var data = req.body['test-editormd-markdown-doc'];

  var objRegExp = /^# .+\r\n(\r\n)*.+/;
  var panduan = objRegExp.test(data);
  if (!panduan) {
    return next(new Error("2-add-后台文章格式不对，提交失败"));
  }

  var post = {};
  post._id = req.body['_id'];
  post.content = req.body['test-editormd-markdown-doc'];
  post.created = req.body['created'];

  var conditions = {};
  conditions._id = mongoose.Types.ObjectId(post._id);

  Post.remove(conditions).exec(function (err, rowsRemoved) {
    if (err) {
      return next(err);
    }

    Post.create({
      "content": post.content,
      "created": post.created
    }, function(err, result){
      if(err) return next(err);
      return res.redirect('/admin/posts');
    });
  });
});

router.get('/delete/:id', checkLogin, function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('no post id provided'));
  }

  var conditions = {};
  conditions._id = mongoose.Types.ObjectId(req.params.id);

  Post.remove(conditions).exec(function (err, rowsRemoved) {
    if (err) return next(err);

    return res.redirect('/admin/posts');
  });
});

router.get('/search', checkLogin, function (req, res, next) {
  var searchfor = req.query.searchfor;

  if (!searchfor) {
    return next(new Error('搜索内容为空'));
  }

  var conditions = {};

  Post.find(conditions)
    .exec(function (err, posts) {
      if (err) return next(err);

      var searchedposts = [];
      posts.forEach(function(post){
        var str = post.content;
        var panduan = str.indexOf(searchfor);
        if(panduan != -1){
          searchedposts.push(post);
        }
      });

      var compiledposts = searchedposts.map(function(rawpost){
        var post = {};

        var data = rawpost.content;
        var index = data.indexOf('\r\n');
        post.title = data.slice(2, index);
        post.content = data.slice(index+2);
        post.created = rawpost.created;
        post._id = rawpost._id;

        return post;
      });

      res.render('admin/post/searched', {
        posts: compiledposts
      });
    });
});
