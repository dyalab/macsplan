//http methods
//get
//post -> creating data
//put -> update data
// delete
var xmlrpc = require('xmlrpc');
var client = xmlrpc.createClient({host:'localhost', port:8080, path: '/RPC2'});

//importing and initializing express
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname));

app.get('/' /*root url*/, (req, res)=>{
  res.sendFile('input.html',{root: path.join(__dirname)});
});

app.get('/courseCatalogData', (req, res) =>{
	res.sendFile('courseCatalogData.json', {root: path.join(__dirname)});

});

app.get('/majorData', (req, res) =>{
	res.sendFile('majorData.json', {root: path.join(__dirname)});

});



//PORT
//const port = process.env.PORT || 80;
const port = 80;
app.listen(port, ()=>{console.log('listening on port ' + port );});
