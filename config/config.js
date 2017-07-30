var path = require('path'),
    rootPath = path.normalize(__dirname + '/..');
    //env = process.env.NODE_ENV || 'development';
    env = 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'ownblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ownblog-development'
  },

  test: {
    root: rootPath,
    app: {
      name: 'ownblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ownblog-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'ownblog'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/ownblog-production'
  }
};

module.exports = config[env];
