const https = require('https'),
	  fs = require('fs');

var tree = [],
	writeData = {"incidents":[], "dateCreated":null},
	amnt = 0;

const main = function(){
	try {	
		getSha();
	}catch(exception){
		process.stdout.write("ERROR: ", exception);
	}
}();

function makeHTTPSGetRequest(options, callback){
	https.request(options, function(response){
		data = '';
		response.on('data', function(chunk){
			data += chunk;
		})

		response.on('end', function(){
			callback(data);
		});
	}).end();
}

function getSha(){
	process.stdout.write("Getting latest relevant SHA...\n");
	process.stdout.write("Please wait one moment..\n");


	var options = {
	  	host: 'api.github.com',
	  	path: '/repos/vz-risk/VCDB/commits?path=data/json',
	  	headers: {
	        accept: 'application/vnd.github.v3+json',
	        'User-Agent': 'verisScript'
	    }
	}

	makeHTTPSGetRequest(options, function(data){
		getTree(JSON.parse(data)[0].sha);
	});
}

function getTree(sha){
	process.stdout.write("Requesting tree...\n");
	process.stdout.write("This may take a 1-2 minute(s) to download..\n");

	var options = {
	  	host: 'api.github.com',
	  	path: '/repos/vz-risk/VCDB/git/trees/' + sha + "?recursive=1",
	  	headers: {
	        accept: 'application/vnd.github.v3+json',
	        'User-Agent': 'verisScript'
	    }
	}

	makeHTTPSGetRequest(options, function(data){
		var args = process.argv.slice(2);
		tree = JSON.parse(data).tree;
		writeData.dateCreated = new Date();
		amnt = args.length < 1 || isNaN(Number(args[0])) ? tree.length : Number(args[0]);
		requestIncident(0);
	});
}


function requestIncident(index){
	if (writeData.incidents.length >= amnt || index >= tree.length){ 
		writeIncidentJSON();
	}else if (isIncident(tree[index])){
		var opt = {
			host: 'raw.githubusercontent.com',
			path: '/vz-risk/VCDB/master/' + tree[index].path,
			headers: {'User-Agent': 'verisScript' }
		};

		makeHTTPSGetRequest(opt, function(res){
			process.stdout.write("Investigated " + tree[index].path.toString() + "\n");
			var incident = JSON.parse(res);
			if (Object.keys(incident.action)[0] == "hacking" &&
				Object.keys(incident.actor)[0] == "external"){
				writeData.incidents.push(incident);
			}
			
			requestIncident(index + 1);
		});
	}else{
		requestIncident(index + 1);
	}
}

function writeIncidentJSON(){
	console.log("writing file...");
	fs.writeFile('hackingIncidents.json', JSON.stringify(writeData), 'utf8', function(err){
		if (err){
			console.log("ERROR: ", err);
		}else{
			console.log("finished writing file!");
		}
	})
}


function isIncident(branch){
	if (!"path" in branch || /DS_Store/.test(branch.path))
		return false;

	var path = branch.path.split("/")
	return path.length > 2 && /\.json/.test(path[path.length - 1]) &&
		path[0]  == "data" && path[1] == "json";
}