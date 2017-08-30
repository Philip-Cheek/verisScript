var data = {}, table, windowReady = false;

var main = function(){
	window.addEventListener('load', function(){ windowReady = true}, false);
	loadJSON('hackingIncidents.json', function(res){ 
		data = res;
		if (windowReady){
			init();
		}
		else{
			window.addEventListener('load', init, false);
		}
	});

}();

function init(){
	table = new Table(40);
	table.loadTBody();
	table.setTHead();
	table.setButtons();
}

var Table = function(pLimit){
	this.pLimit = pLimit ? pLimit : 50;
	this.page = 0;
	this.headers = document.getElementById("head").childNodes[1].cells;
	this.tBody = document.getElementById("incidentTBod"),
	this.next = document.getElementById('n');
	this.prev = document.getElementById('p');
	this.count = document.getElementById('i');
}


Table.prototype.setButtons = function(){
	this.next.addEventListener("click", function(){
		this.page += 1;
		this.loadTBody();
	}.bind(this));

	this.prev.addEventListener("click", function(){
		this.page -= 1;
		this.loadTBody();
	}.bind(this));

}

Table.prototype.setTHead = function(){
	for (var i = 1; i < this.headers.length; i++)
		this.headers[i].addEventListener("click", this.sortHeader.bind(this), true);

	table.sortHeader({"target":this.headers[1]});

}

Table.prototype.loadTBody = function(){
 	var html = "", i = this.pLimit * this.page,
 		max = this.pLimit * (this.page + 1);

 	this.prev.disabled = i < 1;
 	this.next.disabled = data.incidents.length <= max;
 	this.count.innerHTML = max.toString() + "/" + data.incidents.length.toString();
	while (i < data.incidents.length && i < max){
		var incident = data.incidents[i];
		if (!'vicitim_id' in incident.victim)
			continue;

		incident.victim.victim_id  = incident.victim.victim_id ? incident.victim.victim_id : "Unknown";
		var id = incident.victim.victim_id;
		if (id && id.length > 30)
			id = id.substring(0, 27) + "...";

		html += "<tr><td>" + (i + 1).toString() + "</td>";
		html += "<td>" + id+  "</td>";
		html += "<td>" + incident.victim.country[0] + "</td>";
		html += "<td>" + incident.actor.external.country[0] + "</td>"
		html += "<td>" + incident.actor.external.motive[0] + "</td>";
		html += "<td>" + incident.actor.external.variety[0] + "</td><td>";

		if (incident.timeline && incident.timeline["incident"]){
			var time = incident.timeline["incident"],
				date = [];

			if (time.month) date.push(time.month);
			if (time.day) date.push(time.day);
			if (time.year) date.push(time.year);

			html += date.join("/");
		}

		html += "</td></tr>"
		++i;
	}

	this.tBody.innerHTML = html;
}


Table.prototype.sortHeader = function(e){
	var head = "";
	for (var i = 1; i < this.headers.length; i++){
		var splitH = this.headers[i].innerHTML.split(" ");
		this.headers[i].innerHTML = splitH[0] + " " + splitH[1];
		if (this.headers[i].innerHTML == e.target.innerHTML)
			head = this.headers[i].innerHTML;
		else if (this.headers[i].className)
			this.headers[i].className = "";
	}

	if (!e.target.className){
		e.target.className = "asc";
		e.target.innerHTML += " &#x25B2;"
	}else if (e.target.className == "desc"){
		e.target.className = "asc";
		e.target.innerHTML += " &#x25B2;"
	}else if (e.target.className == "asc"){
		e.target.className = "desc";
		e.target.innerHTML += " &#x25BC;"
	}

	this.sortIncidents(head, e.target.className == "desc");
	this.loadTBody();
}

Table.prototype.sortIncidents = function(head, desc){
	switch(head){
		case "Victim ID":
			if (desc){
				this.sort(data.incidents, function(x, y){
					return x.victim.victim_id < y.victim.victim_id;
				});
			} else {
				this.sort(data.incidents, function(x, y){
					return x.victim.victim_id > y.victim.victim_id;
				});
			}
			break;
		case "Victim Country":
			if (desc){
				this.sort(data.incidents, function(x, y){
					return x.victim.country[0] < y.victim.country[0];
				});
			} else {
				this.sort(data.incidents, function(x, y){
					return x.victim.country[0] > y.victim.country[0];
				});
			}
			break;
		case "Actor Country":
			if (desc){
				this.sort(data.incidents, function(x, y){
					return x.actor.external.country[0] < y.actor.external.country[0]
				});
			} else {
				this.sort(data.incidents, function(x, y){
					return x.actor.external.country[0] > y.actor.external.country[0]
				});
			}
			break;
		case "Actor Motive":
			if (desc){
				this.sort(data.incidents, function(x, y){
					return x.actor.external.motive[0] < y.actor.external.motive[0]
				});
			} else {
				this.sort(data.incidents, function(x, y){
					return x.actor.external.motive[0] > y.actor.external.motive[0]
				});
			}
			break;
		case "Actor Variety":
			if (desc){
				this.sort(data.incidents, function(x, y){
					return x.actor.external.variety[0] < y.actor.external.variety[0]
				});
			} else {
				this.sort(data.incidents, function(x, y){
					return x.actor.external.variety[0] > y.actor.external.variety[0]
				});
			}
			break;
		case "Incident Date":
			if (desc){
				this.sort(data.incidents, function(x, y){
					var xTime = x.timeline.incident,
						yTime = y.timeline.incident,
						keys = ["year", "month", "day"];

					for (var i = 0; i < 3; i++){
						if (!xTime[keys[i]] && yTime[keys[i]])
							return true;
						else if (!yTime[keys[i]] && xTime[keys[i]])
							return false;
						else if (xTime[keys[i]] && yTime[keys[i]] && yTime[keys[i]] != xTime[keys[i]])
							return xTime[keys[i]] < yTime[keys[i]];
					}
				});
			} else {
				this.sort(data.incidents, function(x, y){
					var xTime = x.timeline.incident,
						yTime = y.timeline.incident,
						keys = ["year", "month", "day"];

					for (var i = 0; i < 3; i++){
						if (!xTime[keys[i]] && yTime[keys[i]])
							return false;
						else if (!yTime[keys[i]] && xTime[keys[i]])
							return true;
						else if (xTime[keys[i]] && yTime[keys[i]] && yTime[keys[i]] != xTime[keys[i]])
							return xTime[keys[i]] > yTime[keys[i]];
					}
				});
			}
			break;

	}

}

Table.prototype.sort = function(arr, callback){
 	for (var i = 0; i < arr.length - 1; i++){
 		comp = i;
 		for (var x = i + 1; x < arr.length; x++){
 			if (callback(arr[comp], arr[x]))
 				comp = x;
 		}

 		if (comp != i){
 			var tmp = arr[i];
 			arr[i] = arr[comp];
 			arr[comp] = tmp;
 		}

 	}
}


function loadJSON(url, callback) {   

    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
   		xobj.open('GET', url, true); 
    	xobj.onreadystatechange = function (res) {
          if (xobj.readyState == 4 && xobj.status == "200") {
            callback(JSON.parse(xobj.responseText));
          }
    };
    xobj.send(null); 
 }



