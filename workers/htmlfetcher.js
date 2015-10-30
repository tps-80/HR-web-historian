// Use the code in `archive-helpers.js` to actually download the urls
// that are waiting.

var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');


//run a function on a specified interval that reads the list,
//checks if any urls in the list have yet to be archived,
//and if so, archive the unarchived sites

exports.cron = function(){
  var sites = [];
  archive.readListOfUrls(function(arr){
    for (var i=0; i<arr.length; i++){
      var thing = arr[i];
      (function(url){
        archive.isUrlArchived(url, function(exists){
        if(!exists) {
          archive.downloadUrls([url]);
        }
      })
      }(thing))
    }
  })
}
