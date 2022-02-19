var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function (request, response) {
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    console.log(queryData);
    if (_url == '/') {
        _url = '/index.html';
    }
    if (_url == '/favicon.ico') {
        return response.writeHead(404);
    }
    response.writeHead(200);
    fs.readFile(`data/${queryData.id}`, 'utf-8', (err, data) => {
        var content = `<!doctype html>
        <html>
        <head>
        <title>WEB1 - ${data}</title>
        <meta charset="utf-8">
        </head>
        
        <body>
          <h1><a href="index.html">WEB</a><h1>
        <ol> <!-- 리스트 부모태그 ul 연관성을 나타내기 위해서 사용 ol은 자동으로 숫자를 넘버링 해줌 개꿀임-->
          <li><a href="/?id=HTML">HTML</a></li>
          <li><a href="/?id=CSS">CSS</a></li>
          <li><a href="/?id=Javascript">JavaScript</a></li>
        </ol>
        <h2>WEB</h2>
        <p>${data}</p>
        </body>
        </html>
        `;
        response.end(content);
    })

});
app.listen(3000);