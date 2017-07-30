var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Post = mongoose.model('Post'),
  fs = require('fs');

module.exports = function (app) {
  app.use('/posts', router);
};

router.get('/', function (req, res, next) {
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
      res.render('blog/posts', {
        posts: posts,
        pretty: true
      });
  });
});

router.get('/view/:id', function (req, res, next) {
  if (!req.params.id) {
    return next(new Error('no post id provided'));
  }

  var conditions = {};
  conditions._id = mongoose.Types.ObjectId(req.params.id);

  Post.findOne(conditions)
    .exec(function (err, post) {
      if (err) return next(err);

      var data = post.content;
      var index = data.indexOf('\r\n');
      post.title = data.slice(2, index);

      res.render('blog/view', {
        post: post
      });
    });
});

router.get('/search', function (req, res, next) {
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

      res.render('blog/searched', {
        posts: compiledposts
      });
    });
});
