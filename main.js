var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {

      fs.readdir('./data', (err, fileList) => {
        var title = 'Welcome';
        var data = 'Hello Node.js';
        var List = '<ul>';
        var i = 0;
        while (i < fileList.length) {
          List += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
          i = i + 1;
        }
        List += '</ul>';

        var content = `
                  <!doctype html>
                  <html>
                  <head>
                  <title>WEB1 - ${title}</title>
                  <meta charset="utf-8">
                  </head>
                  
                  <body>
                    <h1><a href="/">WEB</a><h1>
                  ${List}
                  <h2>${title}</h2>
                  <p>${data}</p>
                  </body>
                  </html>
                  `;
        response.writeHead(200);
        response.end(content);
      })

    }
    else {
      fs.readdir('./data', (err, fileList) => {
        var title = queryData.id;
        var List = '<ul>';
        var i = 0;
        while (i < fileList.length) {
          List += `<li><a href="/?id=${fileList[i]}">${fileList[i]}</a></li>`
          i += 1;
        }
        List += '</ul>';
        fs.readFile(`data/${queryData.id}`, 'utf-8', (err, data) => {
          var title = queryData.id;
          var content = `
            <!doctype html>
            <html>
            <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
            </head>
            
            <body>
              <h1><a href="/">WEB</a><h1>
            ${List}
            <h2>${title}</h2>
            <p>${data}</p>
            </body>
            </html>
            `;
          response.writeHead(200);
          response.end(content);
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