var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');
//var pdf = require('pdfkit');
//var fs =require('fs');
var app = express();

// var myDoc = new pdf;

// myDoc.pipe(fs.createWriteStream('node.pdf'));

// myDoc.font('Times-Roman')
// 	.fontSize(48)
// 	.text('shdjsahjdas',100,100);
// myDoc.end();

var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(config.database, function(err){
	if(err){
		console.log(err);
	}else{
		console.log('connected to the database');
	}
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('dev'));

app.use(express.static(__dirname + '/public')); //render files

var api = require('./app/routes/api')(app, express, io);
app.use('/api',api);

app.get('*', function(req,res){
	res.sendFile(__dirname + '/public/app/views/index.html');
});
 
http.listen(config.port, function(err){
	if(err){ 
		console.log(err);
	}else{
		console.log('Listening on port 3000');
	}
});
