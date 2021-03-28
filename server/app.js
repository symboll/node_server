const http = require('http')

http.createServer((req, res)=> {

  console.log('res', res)
  res.writeHead(200, {'Content-type' : 'text/html'});
  res.write('<h1>Node.js</h1>');
  res.end('<p>Hello World</p>');
}).listen(8000)