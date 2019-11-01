var http = require('http');
var express = require('express');
var WSS = require('ws').Server;
var mysql = require('mysql');
var request = require('request');
/*
var con = mysql.createConnection({
  host: ("94.237.76.93"),
  port: 3306,
  database: "dwansoft_alg",
  user: "dwansoft_alg",
  password: "Dwansoft123"
});*/


var port = process.env.PORT || 8081;

var app = express().use(express.static('public'));
//app.listen(process.env.PORT || 3000);
var server = http.createServer(app);
//server.listen(process.env.PORT || 3000);
server.listen(port ,function(){
    console.log("up and running on port "+ port);
});

//server.listen(3000, '127.0.0.1');
//server.listen(process.env.PORT || 3000);
//server.listen(process.env.PORT, () => {});
var wss = new WSS({ port: process.env.PORT || 8081 });
wss.on('connection', function(socket) {
  console.log('Opened Connection 🎉');

  var json = JSON.stringify({ message: 'Gotcha' });
  socket.send(json);
  console.log('Sent: ' + json);

  socket.on('message', function(message) {
    console.log('Received: ' + message);

    wss.clients.forEach(function each(client) {

       

      var json = JSON.stringify({ message: 'Something changed' });
      client.send(json);
      console.log('Sent: ' + json);
    });
  });

  socket.on('close', function() {
    console.log('Closed Connection 😱');
    
  });

});

var message="";
var broadcast = function() {
  var datetime = new Date();


  wss.clients.forEach(function each(client) {

   
    var queryString = 'SELECT * FROM market limit 1';
    
    /*con.query(queryString, function(err, rows, fields) {
        if (err) throw err;
    
        for (var i in rows) {
          message = rows[i].amount;
            console.log('Query Result: ', rows[i].amount);
        }
        con.end();
    });
  */
 
 request.get({
    headers: {'content-type' : 'application/x-www-form-urlencoded'},
    url:     'https://min-api.cryptocompare.com/data/price?fsym=BTC&tsyms=USD',
    //body:    "mes=heydude"
  }, function(error, response, body){
    console.log(body);
    var response = JSON.parse(body);
    message = response["USD"];
  });

    
  var json = JSON.stringify({
    message: message
  });

    client.send(json);
    console.log('Sent: ' + json);
  });

  
}
setInterval(broadcast, 1000);