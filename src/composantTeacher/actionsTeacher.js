const colTeacher  = require('./modeleTeacher');
const processTeacher = require('./processTeacher');
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');
const ical = require('node-ical');
const path = require('path');
const fs = require('fs');

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
        // let pwd= bcrypt.hashSync(req.body.mdp, 8)
        // // Creattion du token
        // let tkn = jwt.sign({nameTeacher:req.body.nom, lastnameTeacher:req.body.prenom, mailTeacher:req.body.mail}, 'SecretTopSecret');
        let myTeacher= new colTeacher({
            nameTeacher: req.body.nom,
            lastnameTeacher: req.body.prenom,
            mailTeacher: req.body.mail,
            // passwordTeacher:pwd,
            classTeacher: req.body.statut,
            // token: tkn,
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
    },

    actionsParseIcalFile: (req, res)=>{
        //req.nom et req.prenom
        let urlDownloadIcs='https://edt.univ-evry.fr/icsprof/'+req.params.name+'_'+req.params.lastname+'.ics';
        let icsFile=[];
        let dataExtract=[];
        let typeCourse=[];
        let typeCourse2=[];
        let period=[];
        let myFinalData=[];
        let i=0;
        let numCM=0;
        let numTD=0;
        let numTP=0;
        let numExam=0;

        ical.fromURL(urlDownloadIcs, {}, function(err, data) {
            if (err) console.log(err);
           
            for (let i in data) {
                const ev = data[i];
                icsFile[i]=data[i].description.val;
                dataExtract = icsFile[i].split("\\");
                // console.log(dataExtract); // datas non nettoyées

                // For the type of course
                typeCourse[i]=dataExtract[0].split(" - ")[1]; 
                if (typeCourse[i]==undefined){
                    typeCourse[i]=dataExtract[0].split(" : ")[1]
                }
                typeCourse2[i]=typeCourse[i].split("\n")[0];
                
                // For the period
                period[i]=dataExtract[0].split(" : ")[3];
                if (period[i]==undefined){
                    period[i]=dataExtract[0].split(" : ")[2];
                }
                // Datas semi-cleaned
                myFinalData=[].concat(typeCourse2[i],period[i].split("\n")[0]);

                // Clean some wrong datas
                if (myFinalData[0] != "CM" && myFinalData[0] !="TD" && myFinalData[0] !="TP" && myFinalData[0] !="Examen"){
                    if(myFinalData[0].includes("TD")){
                        console.log("replace:"+myFinalData[0]);
                        myFinalData[0]="TD"
                    }else if (myFinalData[0].includes("TP")){
                        console.log("replace:"+myFinalData[0]);
                        myFinalData[0]="TP"
                    }else {
                        console.log("replace:"+myFinalData[0]);
                        myFinalData[0]="CM"
                    }
                   
                }
                // total of hours by type done by the teacher
                switch (myFinalData[0]){
                    case "CM": numCM+=1; break;
                    case "TD": numTD+=1;  break;
                    case "TP": numTP+=1; break;
                    case "Examen":numExam+=1;break;
                }
                console.log(myFinalData);       
            } 
           
            console.log([numCM,numTD,numTP,numExam]);
            res.json({ 
                hourCM: numCM,
                hourTD: numTD,
                hourTP: numTP,
                hourExam: numExam });       
            })

        
    }
}