var crypto = require('crypto');

module.exports = function(mingma){
    var salt = "Kgf678bo,P-@";
    var md5 = crypto.createHash('md5');
    var crypted = md5.update(mingma + salt).digest('hex');
    return crypted;
};

