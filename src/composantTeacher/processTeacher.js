const colTeacher = require('./modeleTeacher');
const ObjectId = require('mongodb').ObjectID
const jwt = require ('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports={
    
    processShowTeacher:(id)=>{
        return new Promise((resolve,reject)=>{
            colTeacher.findOne({_id: id},(err, teacher)=> {
                if (!teacher){
                    reject('Do not found teacher')
                }
                if(err){
                    reject('Error')
                }
                resolve(teacher)     
            });
        })
    },

    processAllTeachers:()=>{
        return new Promise((resolve,reject)=>{
            colTeacher.find({},(err, teachers)=> {
                if (err) reject('Error')
                resolve(teachers)  
            });
        })       
    },

    processConnexionTeacher:(mail,password)=>{
        return new Promise((resolve,reject)=>{
            colTeacher.findOne({mailTeacher:mail}, (err, teacher)=>{
                if(!teacher){ 
                    reject('Do not found teacher');
                }else{
                    if(err){
                        reject('Server problem');
                    }else{
                        let passwordIsValid= bcrypt.compareSync(password,teacher.passwordTeacher);
                        if (!passwordIsValid){ 
                            reject('Invalid password');
                        }else{
                            resolve({message:'success login',teacher,auth:true, token: teacher.token, idMongo: teacher._id, mail: teacher.mailTeacher});
                        }
                    }
                } 
                
            });
        });
    },

    processPostTeacher:(myTeacher)=>{  
        return new Promise((resolve, reject)=>{
            // On verifie si un utilisateur est deja crée avec le meme Pseudo
            colTeacher.findOne({mailTeacher: myTeacher.mailTeacher},(err, teacher)=> {
                if (err){
                    reject(500);
                } 

                if (!teacher){
                    myTeacher.save(function(err,teacherPosted){
                        if(err){
                            reject(501);
                        } 
                        resolve({message:'Teacher posted !', teacherPosted});
                    })
                }else{ 
                    reject(400);
                }      
            });
        });
    },

    processDeleteTeacher:(id)=>{
        return new Promise ((resolve,reject)=>{
            colTeacher.deleteOne({_id: ObjectId(id)},(err,teacher)=>{
                if(!teacher){
                    reject("Do not found teacher");
                }else{
                    if(err){ 
                        reject("Error");
                    }else{
                        resolve({message:'teacher deleted', teacher: teacher});
                    }
                    
                } 
            })
        })
    },

    processUpdateTeacher:(id, newTeacher)=>{
        return new Promise((resolve,reject)=>{
            colTeacher.findOne({_id: ObjectId(id)},(err, teacher)=> {
                if (!teacher){
                    reject('Do not found teacher')
                }else{
                    if (err) {
                        reject('Error')
                    }else{
                        teacher.nameTeacher= newTeacher.nameTeacher
                        teacher.lastnameTeacher= newTeacher.lastnameTeacher
                        teacher.mailTeacher= newTeacher.mailTeacher
                        teacher.passwordTeacher= newTeacher.passwordTeacher
                        teacher.classTeacher= newTeacher.classTeacher
                        teacher.token= newTeacher.token
                        
                        teacher.save((err,teacherSaved)=>{
                            if(err){
                                reject("Error in save methode")
                            }
                            resolve({message:'Teacher Updated !',teacher: teacherSaved})
                        });  
                    }
                }    
            });
        })
    },

   
    processSumHoursTeacher:(id, newTeacher)=>{
        
    },
    
}