var http = require('http');
var fs = require('fs');

var port = process.env.PORT || 5000;

http.createServer(function(request, response) {
    response.writeHead(200);
    fs.readFile('home.html', function(err, contents) {
        response.write(contents);
        response.end();
    });
}).listen(port);
console.log("Node application running on port", port);
