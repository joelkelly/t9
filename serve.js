 var express    = require("express");
 var opener     = require("opener");
 var app        = express();

 /* serves main page */
 app.get("/", function(req, res) {
    res.sendFile('index.html');
 });


 /* serves all the static files */
 app.get(/^(.+)$/, function(req, res){
     res.sendFile( __dirname + req.params[0]);
 });

 var port = process.env.PORT || 9000;
 app.listen(port, function() {
   console.log("Listening on " + port);
   opener("http://localhost:9000");
 });