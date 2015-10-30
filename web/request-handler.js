var path = require('path');
var archive = require('../helpers/archive-helpers');
var fs = require('fs');
var cronFile = require('../workers/htmlfetcher');

// require more modules/folders here!

exports.handleRequest = function (req, res) {

  // if get request, run isURLarchived(req.url), false
  if (req.method === "GET") {
    if (req.url === "/") {
      fs.readFile(archive.paths.home, function(err, html){
        if (err) {
          console.log(err);
        }
        res.writeHeader(200, {"Content-Type": "text/html"});  
        res.write(html);  
        res.end();
      })
    } else if (req.url === "/styles.css" || req.url === "/favicon.ico") {
      res.end()
    } else {
      archive.isUrlArchived(req.url.slice(1), function(exist){
        if (exist) {
          fs.readFile(archive.paths.archivedSites + req.url, function(err, html){
            if (err) {
              console.log(err);
            }
            res.writeHeader(200, {"Content-Type": "text/html"});  
            res.write(html.toString());  
            res.end();
          })
        } else {
          res.writeHeader(404);  
          res.end();
        };
      })
    }
  } else if (req.method === "POST") {
    var data = '';
    req.on('data', function(datum){
      data+=datum;
    })
    req.on('end', function(err){
      var site = data.slice(4) + "\n";
      fs.readFile(archive.paths.loading, function(err, html){
        if (err) {
          console.log(err);
        }
        res.writeHead(302);  
        res.write(html);  
        res.end();
      })
      fs.appendFileSync(archive.paths.list, site);
    });
    cronFile.cron();
  }
};
