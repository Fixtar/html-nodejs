var http = require('http');
var fs = require('fs');
var url = require('url');
const { title } = require('process');
var template = require('./lib/template');


var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', (err, fileList) => {
        var title = 'Welcome';
        var description = 'Hello Node.js';

        var list = template.list(fileList);
        var html = template.html(title, list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
      })
    }
    else {
      fs.readdir('./data', (err, fileList) => {
        fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description) => {
          var title = queryData.id;
          var list = template.list(fileList);
          var html = template.html(title, list,
            `<h2>${title}</h2>${description}`,
            `
            <a href="/create">create</a> 
            <a href="/update?id=${title}">update</a>
            <form action="delete_process" method="post"> 
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form> 
            `
          );
          response.writeHead(200);
          response.end(html);
        });
      });
    }
  }
  else if (pathname === '/create') {
    fs.readdir('./data', (err, fileList) => {
      var title = 'Welcome - create';
      var list = template.list(fileList);
      var html = template.html(title, list,
        `
        <form action="http://localhost:3000/create_process" method="post">
          <p><input type="text" name="title" placeholder="title"/></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
         `,
        '');

      response.writeHead(200);
      response.end(html);
    })
  }
  else if (pathname === '/create_process') {
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = new URLSearchParams(body);
      var title = post.get("title");
      var description = post.get("description");
      fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
        response.writeHead(302, { Location: `/?id=${title}` });
        response.end();
      })
    });
  }
  else if (pathname === '/update') {
    fs.readdir('./data', (err, fileList) => {
      fs.readFile(`data/${queryData.id}`, 'utf-8', (err, description) => {
        var title = queryData.id;
        var list = template.list(fileList);
        var html = template.html(title, list,
          `
          <form action="http://localhost:3000/update_process" method="post">
          <input type="hidden" name="id" value="${title}">
          <p>
            <input type="text" name="title" placeholder="title" value="${title}"/>
          </p>
          <p>
            <textarea name="description" placeholder="description">${description}</textarea>
          </p>
          <p>
            <input type="submit" />
          </p>
        </form>
         `,
          `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
        );
        response.writeHead(200);
        response.end(html);
      });
    });
  }
  else if (pathname === '/update_process') {
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = new URLSearchParams(body);
      var id = post.get("id");
      var title = post.get("title");
      var description = post.get("description");

      fs.rename(`data/${id}`, `data/${title}`, function (error) {
        fs.writeFile(`data/${title}`, description, 'utf8', (err) => {
          response.writeHead(302, { Location: `/?id=${title}` });
          response.end();
        })
      });
    });
  }
  else if (pathname === '/delete_process') {
    var body = "";
    request.on('data', function (data) {
      body += data;
    });
    request.on('end', function () {
      var post = new URLSearchParams(body);
      var id = post.get("id");
      fs.unlink(`data/${id}`, function (err) {
        response.writeHead(302, { Location: `/` });
        response.end();
      });
    });
  }
  else {
    response.writeHead(404);
    response.end('Not Found');
  }

});
app.listen(3000);