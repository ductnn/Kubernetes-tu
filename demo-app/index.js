const port = 3000;
const express = require('express');
const app = new express();


app.get('/', function (req, res) {
  res.send('<h1> HELLOOOO KUBERNETES !!!!! </h1>');
});


app.listen(port, function () {
  console.log('🚀 App listening on port:', port);
});
