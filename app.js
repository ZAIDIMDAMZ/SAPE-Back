const express = require('express');
const app = express();
const port = 3000;
//Déclarer les routes______________________
const routesTeachers= require("./src/composantTeacher/routesTeacher")

//_________________________________________
const dataBase = require('./database');

// Use routes-----------------------------------------------------------
app.use('/teachers',routesTeachers)

//Connection à la DB, Lancement du serveur-------------------------------
app.listen(port,function (req, res) {
  console.log('Express server listening on port: ' + port);
})
module.exports= app