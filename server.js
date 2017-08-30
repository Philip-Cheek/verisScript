const http = require('http'),
	  fs = require('fs'),
	  contentTypes = {
		'js': 'text/javascript',
		'html': 'text/html',
		'css': 'text/css',
		'json': 'application/javascript'
	  };

http.createServer(function(req, res){
	var type = '',
		url = req.url.split('/');

	if (url.length < 2 || /favicon/.test(url[1])){
		res.end();
		return;
	}

	var static = url[1] ? url[1] : 'index.html',
		type = url[1] ? url[1].split('.')[url[1].split('.').length - 1] : 'html';

	if (!(type in contentTypes)){
		res.end();
		return;
	}

    fs.readFile(static ,function (err, data){
    	if(data){
    		res.writeHead(200, {'Content-Type': contentTypes[type]});
        	res.write(data);
    	}

    	res.end();
    });
}).listen(8000);

console.log("Check port 8000");