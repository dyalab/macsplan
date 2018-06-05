//http methods
//get
//post -> creating data
//put -> update data
// delete


//importing and initializing express
const express = require('express');
const path = require('path');
const app = express();
app.use(express.static(__dirname));
app.get('/' /*root url*/, (req, res)=>{
  res.sendFile('input.html',{root: path.join(__dirname)});
});

app.get('/schedule' /*root url*/, (req, res)=>{
  res.sendFile('schedule.html',{root: path.join(__dirname)});
});



//PORT
const port = process.env.PORT || 3000;
app.listen(port, ()=>{console.log('listening on port ' + port );});
