var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var http = require('http');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  siteAssets: path.join(__dirname, '../web/public/'),
  archivedSites: path.join(__dirname, '../archives/sites'),
  list: path.join(__dirname, '../archives/sites.txt'),
  home: path.join(__dirname, '../web/public/index.html'),
  loading: path.join(__dirname, '../web/public/loading.html'),
};

// Used for stubbing paths for tests, do not modify
exports.initialize = function(pathsObj) {
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb) {
  fs.readFile(exports.paths.list, function(err, data){
    if (err) {
      console.log(err)
    }
    var array = data.toString().split("\n");
    cb(array);
  })
};

exports.isUrlInList = function(url, cb) {
  //check if URL already exists inside sites.txt
    //if it exists, go into sites folder and serve up the site
    //if it doesn't exist, add it to sites.txt
    exports.readListOfUrls(function(data){
      for (var i = 0; i < data.length; i++) {
        if (data[i] === url) {
          return cb(true);
        }
      };
      return cb(false);
    });
    
};

exports.addUrlToList = function(url, cb) {
  exports.isUrlInList(url, function(data){
    if(!data) {
      fs.appendFile(exports.paths.list, url);
      cb();
    }          
  })
};

exports.isUrlArchived = function(url, cb) {
// check if the file specified by url exists in the testdata/sites folder
// if it does, return the html file within the archive

  fs.exists(exports.paths.archivedSites + '/' + url, function(exists){
    if (exists) {
      cb(exists);
    } else {
      cb(exists);
    }
  })

};

exports.downloadUrls = function(urls) {
  //check list at sites.text,  turn list into an array
    //loop through array
      //compare each item in sites.text to the list
        //if the list item is not in the folder, 
          //download the html of the site

  var data = "";
  for (var i=0; i<urls.length; i++) {
    var site = urls[i];
    (function(url) {
      http.get("http://" + url, function(res){
        res.on("data", function(chunk){
          data += chunk;
        });
        res.on("end",function(){
          fs.writeFileSync(exports.paths.archivedSites + '/' + url, data);
        });
      });
      
    })(site);
  }

};  
