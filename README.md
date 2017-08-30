Hi! 

1. This is my Veris script project. To write the hackingIncidents.json file, run the node script, veris.js, with the number of latest external hacking incidents you’d like written.
Like so:

	node veris.js 20

An unspecified parameter will write all external hacking incidents available in the veris DB.

2. To see the HTML table, run the server.js like so:

	node server.js

And then head over to your localhost at port 8000 in your browser. like so: 

	localhost:8000

I include a hackingIncidents.json file as written by my veris script in the project folder. The file will be rewritten upon running veris.js

Additional files from index.html and veris.js include server.js (for the file), localFormat.js (client side js), and styles.css (stylesheet).
