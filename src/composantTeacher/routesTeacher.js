const express = require('express');
const bodyParser= require('body-parser');
const router = express.Router();
const actionsTeacher = require('./actionsTeacher');

router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

// get teacher or teachers 
router.get('/:id',actionsTeacher.actionGetOneTeacher);
router.get('', actionsTeacher.actionAllTeachers);

// Connexion teacher
router.get('/login/:username/:password',actionsTeacher.actionsConnexionTeacher);

//parser
router.get('/parse/test',actionsTeacher.actionsParseIcalFile);

// Add one teacher
router.post('',actionsTeacher.actionsPostTeacher);

// Delete one teacher
router.delete('/:id',actionsTeacher.actionsDeleteTeacher);

// Update one teacher
router.put('/:id',actionsTeacher.actionsUpdateTeacher);


module.exports = router;