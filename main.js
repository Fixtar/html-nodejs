var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${body}
  </body>
  </html>
  `;
}

function templateList(fileList) {
  var List = '<ul>';
  var i = 0;
  while (i < fileList.length) {
    List += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
    i = i + 1;
  }
  List += '</ul>';
  return List;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {

      fs.readdir('./data', (err, fileList) => {
        var title = 'Welcome';
        var data = 'Hello Node.js';
        var list = templateList(fileList);
        var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);


        response.writeHead(200);
        response.end(template);
      })

    }
    else {
      fs.readdir('./data', (err, fileList) => {
        fs.readFile(`data/${queryData.id}`, 'utf-8', (err, data) => {
          var title = queryData.id;
          var list = templateList(fileList);
          var template = templateHTML(title, list, `<h2>${title}</h2>${data}`);

          response.writeHead(200);
          response.end(template);
        });
      });
    }
  }
  else {
    response.writeHead(404);
    response.end('Not Found');
  }

});
app.listen(3000);