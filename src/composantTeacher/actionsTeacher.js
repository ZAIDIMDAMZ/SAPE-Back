const colTeacher  = require('./modeleTeacher');
const processTeacher = require('./processTeacher');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports={

    actionGetOneTeacher:(req,res)=>{
        processTeacher.processShowTeacher(req.params.id)
       .then((result)=>{
            res.status(200).json(result)
       })
       .catch((errType)=> {
            if(errType==="Do not found teacher") res.status(404).send("No teacher found.")
            if(errType==="Error") res.status(400).send("There was a problem finding the teacher.")
        });
    },

    actionAllTeachers:(req,res)=>{ 
        processTeacher.processAllTeachers()
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((err) => {
            res.status(400).send('There was a problem adding the informations to the database.')
        })
    },
    
    actionsConnexionTeacher:(req,res)=>{ 
        let MailTeacher = req.params.username;
        let password = req.params.password;
        processTeacher.processConnexionTeacher(MailTeacher,password)
        .then((result)=>{
            res.status(200).send(result);
        })

        .catch((err)=>{
            if(err==="Do not found teacher") res.status(404).send("No teacher found.");
            if(err==='Server problem') res.status(500).send("Server error.");
            if(err==='Invalid password') res.status(401).send('Invalid password');
        })
    },

    actionsPostTeacher:(req,res)=>{
        let pwd= bcrypt.hashSync(req.body.mdp, 8);
        // Create du token
        let tkn = jwt.sign({nameTeacher:req.body.nom, lastnameTeacher:req.body.prenom, mailTeacher:req.body.mail}, 'SecretTopSecret');

        let myTeacher= new colTeacher({
            nameTeacher: req.body.nom,
            lastnameTeacher: req.body.prenom,
            mailTeacher: req.body.mail,
            passwordTeacher:pwd,
            classTeacher:req.body.statut,
            token: tkn,
        });
        processTeacher.processPostTeacher(myTeacher)
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((err)=>{
            if(err==400) res.status(err).send('Teacher exist in the database')
            if(err==500) res.status(err).send('Error in the methode save of MongoDB')
            if(err==501) res.status(err).send('Error in the methode findOne of MongoDB')
        })
    },
    
    actionsDeleteTeacher:(req,res)=>{
        processTeacher.processDeleteTeacher(req.params.id)
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((err) => {
            if(err==="Do not found teacher") res.status(404).send("No teacher found.")
            if(err==="Error") res.status(400).send("There was a problem deleting the teacher.")
        })
    },

    actionsUpdateTeacher: (req, res)=>{
        let pwd= bcrypt.hashSync(req.body.mdp, 8)
        // Creattion du token
        let tkn = jwt.sign({nameTeacher:req.body.nom, lastnameTeacher:req.body.prenom, mailTeacher:req.body.mail}, 'SecretTopSecret');
        let myTeacher= new colTeacher({
            nameTeacher: req.body.nom,
            lastnameTeacher: req.body.prenom,
            mailTeacher: req.body.mail,
            passwordTeacher:pwd,
            classTeacher: req.body.statut,
            token: tkn,
        });
        processTeacher.processUpdateTeacher(req.params.id,myTeacher)
        .then((result)=>{
            res.status(200).json(result)
        })
        .catch((errType)=>{
            console.log(errType)
            if(errType=="Do not found teacher") res.status(404).send("No teacher found.")
            if(errType=="Error in save methode") res.status(400).send('Error in the save methode')
            if(errType=="Error") res.status(400).send("There was a problem updating the teacher.")
        })
    }
}
